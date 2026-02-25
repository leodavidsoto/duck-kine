'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard/dashboard.module.css';

const navItems = [
    {
        section: 'Principal', items: [
            { icon: '📊', label: 'Dashboard', href: '/dashboard' },
            { icon: '📅', label: 'Agenda', href: '/agenda' },
            { icon: '📋', label: 'Mi Ficha', href: '/historial' },
        ]
    },
    {
        section: 'Salud', items: [
            { icon: '📈', label: 'Mi Progreso', href: '/progreso' },
            { icon: '💪', label: 'Ejercicios', href: '/ejercicios' },
            { icon: '🎯', label: 'Registro Dolor', href: '/dolor' },
        ]
    },
    {
        section: 'Más', items: [
            { icon: '💳', label: 'Pagos', href: '/pagos' },
            { icon: '🏃', label: 'Programas', href: '/programas' },
            { icon: '🎓', label: 'Academia', href: '/academia' },
        ]
    },
];

export default function PatientLayout({ children }) {
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem('dk_user');
        if (stored) setUser(JSON.parse(stored));
        else window.location.href = '/login';
    }, []);

    if (!user) return null;

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
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
                                    {item.icon} {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
                        {user.firstName} {user.lastName}
                    </div>
                    <button className={styles.logoutBtn}
                        onClick={() => { localStorage.clear(); window.location.href = '/'; }}>
                        🚪 Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
