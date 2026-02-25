'use client';

import { useEffect, useState } from 'react';
import s from '../patient.module.css';
import { appointmentsAPI, professionalsAPI, servicesAPI } from '@/lib/api';

export default function AgendaPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Booking flow state
    const [step, setStep] = useState(1);
    const [services, setServices] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [bookingDone, setBookingDone] = useState(false);

    const [selectedService, setSelectedService] = useState(null);
    const [selectedProfessional, setSelectedProfessional] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => { loadAppointments(); }, []);

    const loadAppointments = async () => {
        try {
            const data = await appointmentsAPI.getMy({});
            setAppointments(data.appointments || data || []);
        } catch { }
        finally { setLoading(false); }
    };

    const openForm = async () => {
        setShowForm(true);
        setStep(1);
        setSelectedService(null);
        setSelectedProfessional('');
        setSelectedDate('');
        setSelectedSlot(null);
        setBookingDone(false);

        try {
            const [svcData, profData] = await Promise.all([
                servicesAPI.getAll(),
                professionalsAPI.getAll(),
            ]);
            setServices(svcData.services || []);
            setProfessionals(profData.professionals || []);
        } catch { }
    };

    const loadSlots = async () => {
        if (!selectedProfessional || !selectedDate) return;
        setSlotsLoading(true);
        setSlots([]);
        try {
            const data = await appointmentsAPI.getAvailable({
                professionalId: selectedProfessional,
                date: selectedDate,
                duration: selectedService?.durationMinutes || 30,
            });
            setSlots(data.slots || []);
        } catch { }
        finally { setSlotsLoading(false); }
    };

    useEffect(() => {
        if (step === 3 && selectedProfessional && selectedDate) {
            loadSlots();
        }
    }, [step, selectedProfessional, selectedDate]);

    const confirmBooking = async () => {
        if (!selectedSlot || !selectedService || !selectedProfessional) return;
        setBooking(true);
        try {
            await appointmentsAPI.create({
                serviceId: selectedService.id,
                professionalId: selectedProfessional,
                startTime: selectedSlot.startTime,
                notes: '',
            });
            setBookingDone(true);
            loadAppointments();
        } catch (err) {
            alert(err.message || 'Error al agendar');
        } finally { setBooking(false); }
    };

    const statusMap = {
        PENDING: { label: 'Pendiente', color: 'warning' },
        CONFIRMED: { label: 'Confirmada', color: 'success' },
        IN_PROGRESS: { label: 'En curso', color: 'info' },
        COMPLETED: { label: 'Completada', color: 'success' },
        CANCELLED: { label: 'Cancelada', color: 'error' },
        NO_SHOW: { label: 'No asistió', color: 'error' },
    };

    const fmt = (d) => new Date(d).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
    const fmtTime = (d) => new Date(d).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    const fmtMoney = (v) => `$${Number(v || 0).toLocaleString('es-CL')}`;

    const today = new Date().toISOString().split('T')[0];
    const profName = (id) => {
        const p = professionals.find(pr => pr.id === id);
        return p ? `${p.firstName} ${p.lastName}` : '';
    };

    return (
        <>
            <div className={s.headerRow}>
                <div className={s.pageHeader}>
                    <h1 className={s.pageTitle}>📅 Mi Agenda</h1>
                    <p className={s.pageDesc}>Tus citas de kinesiología programadas</p>
                </div>
                <button className="btn btn-primary" onClick={openForm}>
                    + Agendar hora
                </button>
            </div>

            {/* ─── Booking Form ──────────────────────────── */}
            {showForm && (
                <div className={s.card}>
                    {bookingDone ? (
                        <div className={s.emptyState}>
                            <div className={s.emptyIcon}>✅</div>
                            <div className={s.emptyTitle}>¡Cita agendada!</div>
                            <p className={s.emptyDesc}>Tu hora fue reservada exitosamente. Te enviaremos un recordatorio.</p>
                            <button className="btn btn-primary" onClick={() => setShowForm(false)}>Cerrar</button>
                        </div>
                    ) : (
                        <>
                            {/* Steps indicator */}
                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', justifyContent: 'center' }}>
                                {[1, 2, 3].map((n) => (
                                    <div key={n} style={{
                                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                                        opacity: step >= n ? 1 : 0.35,
                                    }}>
                                        <span style={{
                                            width: 28, height: 28, borderRadius: '50%', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                                            fontWeight: 800, fontFamily: 'var(--font-display)',
                                            background: step === n ? 'var(--primary-600)' : step > n ? 'var(--success-500)' : 'var(--bg-subtle)',
                                            color: step >= n ? '#fff' : 'var(--text-tertiary)',
                                        }}>
                                            {step > n ? '✓' : n}
                                        </span>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: step >= n ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                                            {n === 1 ? 'Servicio' : n === 2 ? 'Profesional y fecha' : 'Hora'}
                                        </span>
                                        {n < 3 && <span style={{ color: 'var(--text-tertiary)', margin: '0 var(--space-1)' }}>→</span>}
                                    </div>
                                ))}
                            </div>

                            {/* Step 1 — Select service */}
                            {step === 1 && (
                                <>
                                    <h3 className={s.cardTitle}>Selecciona un servicio</h3>
                                    {services.length === 0 ? (
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                                            Cargando servicios...
                                        </p>
                                    ) : (
                                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                            {services.map((svc) => (
                                                <button key={svc.id} onClick={() => { setSelectedService(svc); setStep(2); }}
                                                    style={{
                                                        textAlign: 'left', padding: 'var(--space-4)',
                                                        border: selectedService?.id === svc.id ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                                                        borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                                        background: selectedService?.id === svc.id ? 'var(--primary-50)' : 'var(--bg-card)',
                                                        transition: 'all 0.15s ease',
                                                    }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', marginBottom: 2 }}>
                                                                {svc.name}
                                                            </div>
                                                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                                                                {svc.durationMinutes} min
                                                                {svc.description ? ` · ${svc.description}` : ''}
                                                            </div>
                                                        </div>
                                                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary-600)', whiteSpace: 'nowrap' }}>
                                                            {svc.basePrice ? fmtMoney(svc.basePrice) : '—'}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Step 2 — Select professional + date */}
                            {step === 2 && (
                                <>
                                    <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                                        <strong>Servicio:</strong> {selectedService?.name} ({selectedService?.durationMinutes} min)
                                    </div>

                                    <h3 className={s.cardTitle}>Elige profesional y fecha</h3>

                                    <div className={s.formGrid}>
                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Kinesiólogo</label>
                                            <select className={s.formInput} value={selectedProfessional}
                                                onChange={(e) => setSelectedProfessional(e.target.value)}>
                                                <option value="">Seleccionar...</option>
                                                {professionals.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.firstName} {p.lastName}{p.specialty ? ` — ${p.specialty}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={s.formGroup}>
                                            <label className={s.formLabel}>Fecha</label>
                                            <input type="date" className={s.formInput} min={today}
                                                value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                                        <button className="btn" style={{ border: '1px solid var(--border-light)' }}
                                            onClick={() => setStep(1)}>← Atrás</button>
                                        <button className="btn btn-primary"
                                            disabled={!selectedProfessional || !selectedDate}
                                            onClick={() => setStep(3)}>
                                            Ver horarios →
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Step 3 — Select slot + confirm */}
                            {step === 3 && (
                                <>
                                    <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                                        <strong>Servicio:</strong> {selectedService?.name} · <strong>Profesional:</strong> {profName(selectedProfessional)} · <strong>Fecha:</strong> {selectedDate}
                                    </div>

                                    <h3 className={s.cardTitle}>Elige un horario</h3>

                                    {slotsLoading ? (
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Buscando horarios disponibles...</p>
                                    ) : slots.length === 0 ? (
                                        <div className={s.emptyState}>
                                            <div className={s.emptyIcon}>📅</div>
                                            <div className={s.emptyTitle}>Sin horarios disponibles</div>
                                            <p className={s.emptyDesc}>No hay horas libres para este día. Intenta otra fecha.</p>
                                            <button className="btn btn-primary" onClick={() => setStep(2)}>Cambiar fecha</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{
                                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                                gap: 'var(--space-2)',
                                            }}>
                                                {slots.map((slot, i) => (
                                                    <button key={i} onClick={() => setSelectedSlot(slot)}
                                                        style={{
                                                            padding: 'var(--space-3) var(--space-2)',
                                                            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                                            fontFamily: 'var(--font-display)', fontWeight: 700,
                                                            fontSize: '0.875rem', textAlign: 'center',
                                                            border: selectedSlot === slot ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                                                            background: selectedSlot === slot ? 'var(--primary-50)' : 'var(--bg-card)',
                                                            color: selectedSlot === slot ? 'var(--primary-700)' : 'var(--text-primary)',
                                                            transition: 'all 0.15s ease',
                                                        }}>
                                                        {fmtTime(slot.startTime)}
                                                    </button>
                                                ))}
                                            </div>

                                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                                                <button className="btn" style={{ border: '1px solid var(--border-light)' }}
                                                    onClick={() => setStep(2)}>← Atrás</button>
                                                <button className="btn btn-primary"
                                                    disabled={!selectedSlot || booking}
                                                    onClick={confirmBooking}>
                                                    {booking ? 'Agendando...' : '✓ Confirmar cita'}
                                                </button>
                                                <button className="btn" style={{ border: '1px solid var(--border-light)' }}
                                                    onClick={() => setShowForm(false)}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ─── Appointment List ──────────────────────── */}
            {loading ? (
                <div className={s.card}><p style={{ color: 'var(--text-tertiary)' }}>Cargando citas...</p></div>
            ) : appointments.length === 0 ? (
                <div className={s.card}>
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>📅</div>
                        <div className={s.emptyTitle}>Sin citas agendadas</div>
                        <p className={s.emptyDesc}>Todavía no tienes citas programadas. Agenda tu primera evaluación.</p>
                        <button className="btn btn-primary" onClick={openForm}>Agendar hora</button>
                    </div>
                </div>
            ) : (
                <div className={s.card}>
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Servicio</th>
                                <th>Profesional</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((apt, i) => {
                                const st = statusMap[apt.status] || { label: apt.status, color: 'default' };
                                const canCancel = ['PENDING', 'CONFIRMED'].includes(apt.status);
                                return (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{fmt(apt.startTime)}</td>
                                        <td>{fmtTime(apt.startTime)}</td>
                                        <td>{apt.service?.name || 'Kinesiología'}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>
                                            {apt.professional?.user
                                                ? `${apt.professional.user.firstName} ${apt.professional.user.lastName}`
                                                : '—'}
                                        </td>
                                        <td><span className={`badge badge-${st.color}`}>{st.label}</span></td>
                                        <td>
                                            {canCancel && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('¿Cancelar esta cita?')) {
                                                            await appointmentsAPI.cancel(apt.id);
                                                            loadAppointments();
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: 'var(--error-500)', fontSize: '0.75rem', fontWeight: 600,
                                                    }}>
                                                    Cancelar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
