'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { appointmentsAPI, patientsAPI } from '@/lib/api';

/* ─── Stat SVG Icons ─────────────────────────────────── */
const statIcons = {
    calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <circle cx="12" cy="12" r="10" /><polyline points="9 12 11.5 14.5 16 9.5" />
        </svg>
    ),
    trending: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
        </svg>
    ),
    heart: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
        </svg>
    ),
};

/* ─── Quick Action Icons ─────────────────────────────── */
const qaIcons = {
    schedule: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
        </svg>
    ),
    pain: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
    ),
    exercise: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M6.5 6.5a2 2 0 013 0l8 8a2 2 0 01-3 3l-8-8a2 2 0 010-3z" /><path d="M4.5 8.5L3 10" /><path d="M14 20l1.5-1.5" /><path d="M8.5 4.5L10 3" /><path d="M20 14l-1.5 1.5" />
        </svg>
    ),
    progress: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
};

const quickActions = [
    { icon: qaIcons.schedule, label: 'Agendar hora', href: '/agenda' },
    { icon: qaIcons.pain, label: 'Registrar dolor', href: '/dolor' },
    { icon: qaIcons.exercise, label: 'Mis ejercicios', href: '/ejercicios' },
    { icon: qaIcons.progress, label: 'Ver progreso', href: '/progreso' },
];

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
        } catch {
            // Error loading dashboard data — handled gracefully via empty state
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

    const statCards = [
        { icon: statIcons.calendar, colorClass: styles.statIconGreen, value: stats.upcomingAppointments, label: 'Citas próximas' },
        { icon: statIcons.check, colorClass: styles.statIconBlue, value: stats.completedSessions, label: 'Sesiones completadas' },
        { icon: statIcons.trending, colorClass: styles.statIconYellow, value: `${stats.progressPercent}%`, label: 'Progreso general' },
        { icon: statIcons.heart, colorClass: styles.statIconPurple, value: evaDisplay, label: 'Dolor actual (EVA)' },
    ];

    return (
        <>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.greeting}>
                        Hola, <span className={styles.textGradient}>{user.firstName}</span>
                    </h1>
                    <p className={styles.greetingSub}>Aquí tienes un resumen de tu tratamiento</p>
                </div>
            </header>

            {/* Stats */}
            <div className={styles.statsRow}>
                {statCards.map((s, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={`${styles.statIcon} ${s.colorClass}`}>{s.icon}</div>
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
                                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)', opacity: 0.3 }}>📅</div>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>No tienes citas agendadas</p>
                                <Link href="/agenda" className="btn btn-primary" style={{ display: 'inline-block' }}>
                                    Agendar hora
                                </Link>
                            </div>
                        ) : appointments.map((apt, i) => {
                            const d = formatDate(apt.startTime);
                            const isConfirmed = apt.status === 'CONFIRMED';
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
                                    <span className={`${styles.badge} ${isConfirmed ? styles.badgeSuccess : styles.badgeWarning}`}>
                                        {isConfirmed ? 'Confirmada' : apt.status === 'PENDING' ? 'Pendiente' : apt.status}
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
