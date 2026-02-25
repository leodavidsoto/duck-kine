'use client';

import { useEffect, useState } from 'react';
import s from '../admin.module.css';
import { adminAPI } from '@/lib/api';

export default function AgendaProPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => { loadAppointments(); }, [selectedDate]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const data = await adminAPI.getTodayAppointments(selectedDate);
            setAppointments(data.appointments || []);
        } catch { }
        finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'confirm') await adminAPI.confirmAppointment(id);
            else if (action === 'complete') await adminAPI.completeAppointment(id, {});
            else if (action === 'no-show') await adminAPI.markNoShow(id);
            loadAppointments();
        } catch (err) { alert(err.message); }
    };

    const fmtTime = (d) => new Date(d).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    const statusMap = {
        PENDING: { label: 'Pendiente', color: 'warning' },
        CONFIRMED: { label: 'Confirmada', color: 'success' },
        IN_PROGRESS: { label: 'En curso', color: 'info' },
        COMPLETED: { label: 'Completada', color: 'success' },
        CANCELLED: { label: 'Cancelada', color: 'error' },
        NO_SHOW: { label: 'No asistió', color: 'error' },
    };

    const today = new Date().toISOString().split('T')[0];
    const prevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        setSelectedDate(d.toISOString().split('T')[0]);
    };
    const nextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const pending = appointments.filter(a => a.status === 'PENDING').length;
    const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
    const completed = appointments.filter(a => a.status === 'COMPLETED').length;

    return (
        <>
            <div className={s.headerRow}>
                <div className={s.pageHeader} style={{ marginBottom: 0 }}>
                    <h1 className={s.pageTitle}>📅 Agenda Profesional</h1>
                    <p className={s.pageDesc}>Gestiona tus citas del día</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <button className={s.actionBtn} onClick={prevDay}>←</button>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                        className={s.formInput} style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }} />
                    <button className={s.actionBtn} onClick={nextDay}>→</button>
                    {selectedDate !== today && (
                        <button className={`${s.actionBtn} ${s.actionBtnPrimary}`} onClick={() => setSelectedDate(today)}>Hoy</button>
                    )}
                </div>
            </div>

            {/* Stats for day */}
            <div className={s.grid3} style={{ marginBottom: 'var(--space-5)' }}>
                <div className={s.miniStat}>
                    <span className={s.miniStatValue}>{appointments.length}</span>
                    <span className={s.miniStatLabel}>Total citas</span>
                </div>
                <div className={s.miniStat}>
                    <span className={s.miniStatValue} style={{ color: 'var(--warning-500)' }}>{pending + confirmed}</span>
                    <span className={s.miniStatLabel}>Por atender</span>
                </div>
                <div className={s.miniStat}>
                    <span className={s.miniStatValue} style={{ color: 'var(--success-500)' }}>{completed}</span>
                    <span className={s.miniStatLabel}>Completadas</span>
                </div>
            </div>

            {/* Appointments */}
            <div className={s.card}>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Cargando...</p>
                ) : appointments.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>📅</div>
                        <div className={s.emptyTitle}>Sin citas para este día</div>
                        <p className={s.emptyDesc}>No hay citas programadas.</p>
                    </div>
                ) : (
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Hora</th>
                                <th>Paciente</th>
                                <th>RUT</th>
                                <th>Teléfono</th>
                                <th>Servicio</th>
                                <th>Duración</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((apt) => {
                                const st = statusMap[apt.status] || { label: apt.status, color: 'default' };
                                const pName = apt.patient?.user ? `${apt.patient.user.firstName} ${apt.patient.user.lastName}` : '—';
                                return (
                                    <tr key={apt.id}>
                                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
                                            {fmtTime(apt.startTime)}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{pName}</td>
                                        <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>{apt.patient?.user?.rut || '—'}</td>
                                        <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>{apt.patient?.user?.phone || '—'}</td>
                                        <td>{apt.service?.name || '—'}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{apt.service?.durationMinutes || 30} min</td>
                                        <td><span className={`badge badge-${st.color}`}>{st.label}</span></td>
                                        <td>
                                            <div className={s.actionGroup}>
                                                {apt.status === 'PENDING' && (
                                                    <button className={`${s.actionBtn} ${s.actionBtnSuccess}`}
                                                        onClick={() => handleAction(apt.id, 'confirm')}>✓ Confirmar</button>
                                                )}
                                                {['PENDING', 'CONFIRMED'].includes(apt.status) && (
                                                    <>
                                                        <button className={`${s.actionBtn} ${s.actionBtnPrimary}`}
                                                            onClick={() => handleAction(apt.id, 'complete')}>✅ Completar</button>
                                                        <button className={`${s.actionBtn} ${s.actionBtnError}`}
                                                            onClick={() => handleAction(apt.id, 'no-show')}>✗ No show</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
