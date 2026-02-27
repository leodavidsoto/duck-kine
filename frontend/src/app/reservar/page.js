'use client';

import Navbar from '@/components/layout/Navbar';
import s from './page.module.css';
import { useState, useEffect } from 'react';
import { servicesAPI, appointmentsAPI, authAPI, paymentsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ReservarPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Data State
    const [services, setServices] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);

    // Selection State
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // User State
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', rut: '', phone: '', password: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        if (selectedService && step === 2) {
            loadAvailability();
        }
    }, [selectedService, selectedDate, step]);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await servicesAPI.getAll();
            // Backend returns { services: [...] }
            setServices(data.services || data || []);
        } catch (err) { }
        finally { setLoading(false); }
    };

    const loadAvailability = async () => {
        setLoading(true);
        try {
            const data = await appointmentsAPI.getAvailable({
                serviceId: selectedService.id,
                date: selectedDate
            });
            // Backend returns { slots: [...] }
            setAvailableSlots(data.slots || data || []);
        } catch (err) { }
        finally { setLoading(false); }
    };

    // Calculate end date for calendar
    const minDate = new Date().toISOString().split('T')[0];
    const maxD = new Date();
    maxD.setDate(maxD.getDate() + 30);
    const maxDate = maxD.toISOString().split('T')[0];

    const handleServiceSelect = (srv) => {
        setSelectedService(srv);
        setStep(2);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setStep(3);
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const res = await authAPI.login({ email: formData.email, password: formData.password });
                localStorage.setItem('dk_token', res.token);
            } else {
                const res = await authAPI.register(formData);
                localStorage.setItem('dk_token', res.token);
            }
            setStep(4);
        } catch (err) {
            alert(err.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // 1. Create appointment
            const apt = await appointmentsAPI.create({
                serviceId: selectedService.id,
                professionalId: selectedSlot.professional.id,
                startTime: selectedSlot.startTime,
            });

            // 2. Initiate Payment (Simulated for this flow)
            const payment = await paymentsAPI.init({
                appointmentId: apt.id,
                amount: selectedService.price,
                returnUrl: `${window.location.origin}/checkout/exito`,
            });

            if (payment.url) {
                window.location.href = payment.url;
            } else {
                router.push(`/checkout/exito?payment_id=${payment.id}`);
            }

        } catch (err) {
            alert(err.message || 'Error al confirmar reserva');
        } finally {
            setLoading(false);
        }
    };

    const fmtMoney = (v) => `$${Number(v || 0).toLocaleString('es-CL')}`;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-subtle)' }}>
            <Navbar />

            <main className={`${s.bookingContainer} container`}>
                <div className={s.wizardHeader}>
                    <h1 className={s.wizardTitle}>Reserva de Hora</h1>
                    <p className={s.wizardDesc}>Sigue los pasos para agendar tu atención kinesiológica.</p>

                    <div className={s.stepper}>
                        {['Servicio', 'Fecha y Hora', 'Tus Datos', 'Confirmar'].map((label, i) => (
                            <div key={i} className={`${s.step} ${step === i + 1 ? s.stepActive : step > i + 1 ? s.stepCompleted : ''}`}>
                                <div className={s.stepNum}>{i + 1}</div>
                                <div className={s.stepLabel}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.wizardContent}>
                    {/* STEP 1: SERVICE */}
                    {step === 1 && (
                        <div className={s.stepBody}>
                            <h2 className={s.stepTitle}>Selecciona el servicio</h2>
                            {loading ? <p>Cargando servicios...</p> : (
                                <div className={s.serviceGrid}>
                                    {(Array.isArray(services) ? services : []).map(srv => (
                                        <div key={srv.id} className={s.serviceCard} onClick={() => handleServiceSelect(srv)}>
                                            <h3 className={s.serviceName}>{srv.name}</h3>
                                            <p className={s.serviceCardDesc}>{srv.description}</p>
                                            <div className={s.serviceFooter}>
                                                <span className={s.serviceMeta}>⏱ {srv.durationMinutes} min</span>
                                                <span className={s.servicePrice}>{fmtMoney(srv.price)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: DATETIME */}
                    {step === 2 && (
                        <div className={s.stepBody}>
                            <div className={s.stepHeaderRow}>
                                <h2 className={s.stepTitle}>Elige fecha y hora</h2>
                                <button className={s.backBtn} onClick={() => setStep(1)}>Cambiar servicio</button>
                            </div>

                            <div className={s.datePickerWrapper}>
                                <label>Selecciona una fecha</label>
                                <input
                                    type="date"
                                    className={s.dateInput}
                                    value={selectedDate}
                                    min={minDate}
                                    max={maxDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            <div className={s.slotsContainer}>
                                {loading ? <p>Buscando disponibilidad...</p> : availableSlots.length === 0 ? (
                                    <div className={s.emptySlots}>No hay horas disponibles para esta fecha. Intenta con otro día.</div>
                                ) : (
                                    <div className={s.slotsGrid}>
                                        {availableSlots.map((slot, idx) => (
                                            <div key={idx} className={s.slotCard} onClick={() => handleSlotSelect(slot)}>
                                                <div className={s.slotTime}>
                                                    {new Date(slot.startTime).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className={s.slotProf}>Con {slot.professional.user.firstName} {slot.professional.user.lastName}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: AUTH / IDENTIFICATION */}
                    {step === 3 && (
                        <div className={s.stepBody}>
                            <div className={s.stepHeaderRow}>
                                <h2 className={s.stepTitle}>Identificación</h2>
                                <button className={s.backBtn} onClick={() => setStep(2)}>Cambiar hora</button>
                            </div>

                            <div className={s.authToggle}>
                                <button className={`${s.authTab} ${!isLogin ? s.authTabActive : ''}`} onClick={() => setIsLogin(false)}>
                                    Soy paciente nuevo
                                </button>
                                <button className={`${s.authTab} ${isLogin ? s.authTabActive : ''}`} onClick={() => setIsLogin(true)}>
                                    Ya tengo cuenta
                                </button>
                            </div>

                            <form onSubmit={handleAuthSubmit} className={s.authForm}>
                                {!isLogin && (
                                    <>
                                        <div className={s.formRow}>
                                            <div className={s.formGroup}>
                                                <label>Nombre *</label>
                                                <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                            </div>
                                            <div className={s.formGroup}>
                                                <label>Apellido *</label>
                                                <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className={s.formRow}>
                                            <div className={s.formGroup}>
                                                <label>RUT *</label>
                                                <input required type="text" placeholder="12345678-9" value={formData.rut} onChange={e => setFormData({ ...formData, rut: e.target.value })} />
                                            </div>
                                            <div className={s.formGroup}>
                                                <label>Teléfono *</label>
                                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className={s.formGroup}>
                                    <label>Correo electrónico *</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className={s.formGroup}>
                                    <label>Contraseña *</label>
                                    <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                                    {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión y Continuar' : 'Crear Cuenta y Continuar')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 4: CONFIRMATION */}
                    {step === 4 && selectedService && selectedSlot && (
                        <div className={s.stepBody}>
                            <h2 className={s.stepTitle}>Resumen de la Reserva</h2>

                            <div className={s.summaryCard}>
                                <div className={s.summaryItem}>
                                    <span className={s.symLabel}>Servicio</span>
                                    <span className={s.symValue}>{selectedService.name}</span>
                                </div>
                                <div className={s.summaryItem}>
                                    <span className={s.symLabel}>Profesional</span>
                                    <span className={s.symValue}>{selectedSlot.professional.user.firstName} {selectedSlot.professional.user.lastName}</span>
                                </div>
                                <div className={s.summaryItem}>
                                    <span className={s.symLabel}>Fecha</span>
                                    <span className={s.symValue}>
                                        {new Date(selectedSlot.startTime).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className={s.summaryItem}>
                                    <span className={s.symLabel}>Hora</span>
                                    <span className={s.symValue} style={{ fontSize: '1.25rem' }}>
                                        {new Date(selectedSlot.startTime).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={s.summaryDivider} />
                                <div className={s.summaryItem}>
                                    <span className={s.symLabel}>Total a Pagar</span>
                                    <span className={s.symValue} style={{ fontSize: '1.5rem', color: 'var(--primary-600)' }}>
                                        {fmtMoney(selectedService.price)}
                                    </span>
                                </div>
                            </div>

                            <div className={s.confirmActions}>
                                <button className="btn btn-secondary" onClick={() => setStep(3)}>Atrás</button>
                                <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
                                    {loading ? 'Procesando Pago...' : 'Pagar y Confirmar Cita'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
