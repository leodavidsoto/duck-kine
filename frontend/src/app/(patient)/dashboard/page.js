'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { appointmentsAPI, patientsAPI } from '@/lib/api';

export default function PatientDashboard() {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ upcomingAppointments: 0, completedSessions: 0, progressPercent: 0, latestEva: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('dk_user');
        if (stored) {
            const u = JSON.parse(stored);
            setUser(u);
            loadData();
        }
    }, []);

    const loadData = async () => {
        try {
            const [aptData, statsData] = await Promise.allSettled([
                appointmentsAPI.getMy({ limit: 3 }),
                patientsAPI.getStats(),
            ]);
            if (aptData.status === 'fulfilled') setAppointments(aptData.value.appointments || aptData.value || []);
            if (statsData.status === 'fulfilled') setStats(statsData.value);
        } catch (err) {
            console.log('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const formatDate = (d) => {
        const date = new Date(d);
        return { day: date.getDate(), month: date.toLocaleString('es-CL', { month: 'short' }) };
    };

    const evaDisplay = stats.latestEva !== null ? stats.latestEva : '—';
    const evaEmoji = stats.latestEva === null ? '😊' :
        stats.latestEva <= 2 ? '😊' :
            stats.latestEva <= 5 ? '😐' :
                stats.latestEva <= 7 ? '😣' : '😫';

    const statCards = [
        { icon: '📅', value: stats.upcomingAppointments, label: 'Citas próximas' },
        { icon: '✅', value: stats.completedSessions, label: 'Sesiones completadas' },
        { icon: '📈', value: `${stats.progressPercent}%`, label: 'Progreso general' },
        { icon: evaEmoji, value: evaDisplay, label: 'Dolor actual (EVA)' },
    ];

    return (
        <>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.greeting}>
                        Hola, <span className="text-gradient">{user.firstName}</span>
                    </h1>
                    <p className={styles.greetingSub}>Aquí tienes un resumen de tu tratamiento</p>
                </div>
            </header>

            {/* Stats */}
            <div className={styles.statsRow}>
                {statCards.map((s, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.statIcon}>{s.icon}</div>
                        <span className={styles.statValue}>{loading ? '...' : s.value}</span>
                        <span className={styles.statLabel}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Appointments + Quick Actions */}
            <div className={styles.sectionRow}>
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Próximas citas</h2>
                        <Link href="/agenda" className={styles.panelLink}>Ver todas →</Link>
                    </div>
                    <div className={styles.aptList}>
                        {loading ? (
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Cargando...</p>
                        ) : appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                <p style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📅</p>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No tienes citas agendadas</p>
                                <Link href="/agenda" className="btn btn-primary" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
                                    Agendar hora
                                </Link>
                            </div>
                        ) : appointments.map((apt, i) => {
                            const d = formatDate(apt.startTime);
                            return (
                                <div key={i} className={styles.aptItem}>
                                    <div className={styles.aptDate}>
                                        <span className={styles.aptDay}>{d.day}</span>
                                        <span className={styles.aptMonth}>{d.month}</span>
                                    </div>
                                    <div className={styles.aptInfo}>
                                        <div className={styles.aptService}>{apt.service?.name || 'Kinesiología'}</div>
                                        <div className={styles.aptMeta}>
                                            {new Date(apt.startTime).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <span className={`badge badge-${apt.status === 'CONFIRMED' ? 'success' : 'warning'}`}>
                                        {apt.status === 'CONFIRMED' ? 'Confirmada' : apt.status === 'PENDING' ? 'Pendiente' : apt.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Acciones rápidas</h2>
                    </div>
                    <div className={styles.quickGrid}>
                        {quickActions.map((qa, i) => (
                            <Link key={i} href={qa.href} className={styles.quickItem}>
                                <span className={styles.quickIcon}>{qa.icon}</span>
                                <span className={styles.quickLabel}>{qa.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

const quickActions = [
    { icon: '📅', label: 'Agendar hora', href: '/agenda' },
    { icon: '🎯', label: 'Registrar dolor', href: '/dolor' },
    { icon: '💪', label: 'Mis ejercicios', href: '/ejercicios' },
    { icon: '📊', label: 'Ver progreso', href: '/progreso' },
];
