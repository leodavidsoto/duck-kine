'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

const navItems = [
    {
        section: 'Gestión', items: [
            { icon: '📊', label: 'Dashboard', href: '/admin' },
            { icon: '📅', label: 'Agenda', href: '/agenda-pro' },
            { icon: '👥', label: 'Pacientes', href: '/pacientes' },
        ]
    },
    {
        section: 'Clínica', items: [
            { icon: '📝', label: 'Sesiones', href: '/sesiones' },
            { icon: '💰', label: 'Finanzas', href: '/finanzas' },
        ]
    },
];

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem('dk_user');
        if (stored) {
            const u = JSON.parse(stored);
            const adminRoles = ['PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN', 'ORG_ADMIN', 'CLINIC_DIRECTOR'];
            if (!adminRoles.includes(u.role)) {
                window.location.href = '/dashboard';
                return;
            }
            setUser(u);
        } else {
            window.location.href = '/login';
        }
    }, []);

    if (!user) return null;

    return (
        <div className={styles.adminDashboard}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <div className={styles.sidebarLogoMark}><img src="/assets/images/logo.png" alt="Duck" /></div>
                    <span className={styles.sidebarLogoText}>Duck <span>Kine</span></span>
                </div>
                <div className={styles.sidebarRole}>Panel Profesional</div>

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
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', padding: '0 0.25rem', marginBottom: '0.5rem' }}>
                        Kine. {user.firstName} {user.lastName}
                    </div>
                    <button className={styles.logoutBtn}
                        onClick={() => { localStorage.removeItem('dk_token'); localStorage.removeItem('dk_user'); window.location.href = '/'; }}>
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
