'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard/dashboard.module.css';

/* ─── SVG Icons (20×20, stroke-based) ────────────────── */
const icons = {
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" /><rect x="3" y="14" width="7" height="4" rx="1.5" /><rect x="14" y="11" width="7" height="7" rx="1.5" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
    ),
    clipboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="12" y2="16" />
        </svg>
    ),
    trendingUp: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
        </svg>
    ),
    dumbbell: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5a2 2 0 013 0l8 8a2 2 0 01-3 3l-8-8a2 2 0 010-3z" /><path d="M4.5 8.5L3 10" /><path d="M14 20l1.5-1.5" /><path d="M8.5 4.5L10 3" /><path d="M20 14l-1.5 1.5" />
        </svg>
    ),
    target: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
    ),
    creditCard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="6" y1="15" x2="10" y2="15" />
        </svg>
    ),
    zap: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
    bookOpen: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
    ),
    logOut: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
    menu: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    x: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
};

const navItems = [
    {
        section: 'Principal', items: [
            { icon: icons.dashboard, label: 'Dashboard', href: '/dashboard' },
            { icon: icons.calendar, label: 'Agenda', href: '/agenda' },
            { icon: icons.clipboard, label: 'Mi Ficha', href: '/historial' },
        ]
    },
    {
        section: 'Salud', items: [
            { icon: icons.trendingUp, label: 'Mi Progreso', href: '/progreso' },
            { icon: icons.dumbbell, label: 'Ejercicios', href: '/ejercicios' },
            { icon: icons.target, label: 'Registro Dolor', href: '/dolor' },
        ]
    },
    {
        section: 'Más', items: [
            { icon: icons.creditCard, label: 'Pagos', href: '/pagos' },
            { icon: icons.zap, label: 'Programas', href: '/programas' },
            { icon: icons.bookOpen, label: 'Academia', href: '/academia' },
        ]
    },
];

export default function PatientLayout({ children }) {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem('dk_user');
        if (stored) setUser(JSON.parse(stored));
        else window.location.href = '/login';
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (!user) return null;

    const initials = `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase();

    return (
        <div className={styles.dashboard}>
            {/* Mobile top bar */}
            <div className={styles.mobileTopBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={styles.sidebarLogoMark}>🦆</div>
                    <span className={styles.sidebarLogoText}>Duck <span>Kine</span></span>
                </div>
                <button
                    className={styles.hamburger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="toggle menu"
                >
                    {sidebarOpen ? icons.x : icons.menu}
                </button>
            </div>

            {/* Mobile overlay */}
            <div
                className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarLogo}>
                    <div className={styles.sidebarLogoMark}>🦆</div>
                    <span className={styles.sidebarLogoText}>Duck <span>Kine</span></span>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((group) => (
                        <div key={group.section}>
                            <span className={styles.navSection}>{group.section}</span>
                            {group.items.map((item) => (
                                <Link key={item.href} href={item.href}
                                    className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}>
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>{initials}</div>
                        <div>
                            <div className={styles.userName}>{user.firstName} {user.lastName}</div>
                            <div className={styles.userRole}>Paciente</div>
                        </div>
                    </div>
                    <button className={styles.logoutBtn}
                        onClick={() => { localStorage.removeItem('dk_token'); localStorage.removeItem('dk_user'); window.location.href = '/'; }}>
                        {icons.logOut}
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
