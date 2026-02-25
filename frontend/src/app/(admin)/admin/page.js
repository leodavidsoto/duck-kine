'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from '../admin.module.css';
import { adminAPI } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('dk_user');
        if (stored) setUser(JSON.parse(stored));
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [st, apts] = await Promise.allSettled([
                adminAPI.getStats(),
                adminAPI.getTodayAppointments(),
            ]);
            if (st.status === 'fulfilled') setStats(st.value);
            if (apts.status === 'fulfilled') setAppointments(apts.value.appointments || []);
        } catch { }
        finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'confirm') await adminAPI.confirmAppointment(id);
            else if (action === 'complete') await adminAPI.completeAppointment(id, {});
            else if (action === 'no-show') await adminAPI.markNoShow(id);
            loadData();
        } catch (err) { alert(err.message); }
    };

    const fmtTime = (d) => new Date(d).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    const fmtMoney = (v) => `$${Number(v || 0).toLocaleString('es-CL')}`;

    const statusMap = {
        PENDING: { label: 'Pendiente', color: 'warning' },
        CONFIRMED: { label: 'Confirmada', color: 'success' },
        IN_PROGRESS: { label: 'En curso', color: 'info' },
        COMPLETED: { label: 'Completada', color: 'success' },
        CANCELLED: { label: 'Cancelada', color: 'error' },
        NO_SHOW: { label: 'No asistió', color: 'error' },
    };

    const kpis = stats ? [
        { icon: '📅', value: stats.todayAppointments, label: 'Citas hoy' },
        { icon: '✅', value: stats.completedToday, label: 'Atendidos hoy' },
        { icon: '👥', value: stats.totalPatients, label: 'Total pacientes' },
        { icon: '🆕', value: stats.newPatientsMonth, label: 'Nuevos este mes' },
        { icon: '📊', value: stats.weekAppointments, label: 'Citas semana' },
        { icon: '💰', value: fmtMoney(stats.monthRevenue), label: 'Ingresos mes' },
        { icon: '⏳', value: stats.pendingPayments, label: 'Pagos pendientes' },
    ] : [];

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>
                    Buenos días, <span className="text-gradient">{user?.firstName || 'Doctor'}</span>
                </h1>
                <p className={s.pageDesc}>
                    {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', gridColumn: '1 / -1' }}>Cargando...</p>
                ) : kpis.map((k, i) => (
                    <div key={i} className={s.kpiCard}>
                        <span className={s.kpiIcon}>{k.icon}</span>
                        <span className={s.kpiValue}>{k.value}</span>
                        <span className={s.kpiLabel}>{k.label}</span>
                    </div>
                ))}
            </div>

            {/* Today's appointments */}
            <div className={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <h3 className={s.cardTitle} style={{ marginBottom: 0 }}>Agenda de hoy</h3>
                    <Link href="/agenda-pro" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)' }}>Ver completa →</Link>
                </div>

                {appointments.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>📅</div>
                        <div className={s.emptyTitle}>Sin citas hoy</div>
                        <p className={s.emptyDesc}>No tienes citas programadas para hoy.</p>
                    </div>
                ) : (
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Hora</th>
                                <th>Paciente</th>
                                <th>Servicio</th>
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
                                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fmtTime(apt.startTime)}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{pName}</div>
                                            {apt.patient?.user?.rut && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{apt.patient.user.rut}</div>}
                                        </td>
                                        <td>{apt.service?.name || '—'}</td>
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
                                                            onClick={() => handleAction(apt.id, 'no-show')}>✗ No asistió</button>
                                                    </>
                                                )}
                                                {apt.status === 'COMPLETED' && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Atendido</span>
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
