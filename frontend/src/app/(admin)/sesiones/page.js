'use client';

import { useEffect, useState } from 'react';
import s from '../admin.module.css';
import { adminAPI } from '@/lib/api';

export default function SesionesPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadSessions(); }, []);

    const loadSessions = async () => {
        try {
            const data = await adminAPI.getSessions({});
            setSessions(data.sessions || []);
        } catch { }
        finally { setLoading(false); }
    };

    const fmtDate = (d) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

    const statusMap = {
        SCHEDULED: { label: 'Programada', color: 'warning' },
        IN_PROGRESS: { label: 'En curso', color: 'info' },
        COMPLETED: { label: 'Completada', color: 'success' },
        CANCELLED: { label: 'Cancelada', color: 'error' },
        PATIENT_ABSENT: { label: 'Ausente', color: 'error' },
    };

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>📝 Sesiones</h1>
                <p className={s.pageDesc}>Historial de sesiones clínicas</p>
            </div>

            {/* Stats */}
            <div className={s.grid3} style={{ marginBottom: 'var(--space-5)' }}>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>📝</div>
                    <span className={s.miniStatValue}>{sessions.length}</span>
                    <span className={s.miniStatLabel}>Total sesiones</span>
                </div>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>✅</div>
                    <span className={s.miniStatValue}>{sessions.filter(s => s.status === 'COMPLETED').length}</span>
                    <span className={s.miniStatLabel}>Completadas</span>
                </div>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>📊</div>
                    <span className={s.miniStatValue}>
                        {sessions.length > 0
                            ? (sessions.filter(s => s.progressRating).reduce((a, s) => a + s.progressRating, 0) / Math.max(sessions.filter(s => s.progressRating).length, 1)).toFixed(1)
                            : '—'}
                    </span>
                    <span className={s.miniStatLabel}>Rating promedio</span>
                </div>
            </div>

            <div className={s.card}>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)' }}>Cargando sesiones...</p>
                ) : sessions.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>📝</div>
                        <div className={s.emptyTitle}>Sin sesiones registradas</div>
                        <p className={s.emptyDesc}>Las sesiones se crean automáticamente al completar citas desde la agenda.</p>
                    </div>
                ) : (
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Paciente</th>
                                <th>Servicio</th>
                                <th>EVA Pre</th>
                                <th>EVA Post</th>
                                <th>Progreso</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((sess) => {
                                const st = statusMap[sess.status] || { label: sess.status, color: 'default' };
                                const pName = sess.patient?.user ? `${sess.patient.user.firstName} ${sess.patient.user.lastName}` : '—';
                                return (
                                    <tr key={sess.id}>
                                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                                            {sess.sessionNumber}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{fmtDate(sess.createdAt)}</td>
                                        <td>{pName}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{sess.appointment?.service?.name || '—'}</td>
                                        <td>
                                            {sess.painBefore !== null ? (
                                                <span style={{ fontWeight: 700, color: sess.painBefore <= 3 ? 'var(--success-500)' : sess.painBefore <= 6 ? 'var(--warning-500)' : 'var(--error-500)' }}>
                                                    {sess.painBefore}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td>
                                            {sess.painAfter !== null ? (
                                                <span style={{ fontWeight: 700, color: sess.painAfter <= 3 ? 'var(--success-500)' : sess.painAfter <= 6 ? 'var(--warning-500)' : 'var(--error-500)' }}>
                                                    {sess.painAfter}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td>
                                            {sess.progressRating ? (
                                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                                                    {'⭐'.repeat(sess.progressRating)}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td><span className={`badge badge-${st.color}`}>{st.label}</span></td>
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
