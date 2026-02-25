'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
            <div className={styles.navInner}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoMark}>🦆</div>
                    <span className={styles.logoText}>
                        Duck <span>Kine</span>
                    </span>
                </Link>

                <ul className={styles.navLinks}>
                    <li><a href="#servicios" className={styles.navLink}>Servicios</a></li>
                    <li><a href="#como-funciona" className={styles.navLink}>Cómo funciona</a></li>
                    <li><Link href="/academia" className={styles.navLink}>Academia</Link></li>
                    <li><Link href="/corporativo" className={styles.navLink}>Empresas</Link></li>
                </ul>

                <div className={styles.navActions}>
                    <Link href="/login" className={`btn btn-ghost ${styles.desktopOnly}`}>
                        Iniciar sesión
                    </Link>
                    <Link href="/register" className="btn btn-primary btn-sm">
                        Agendar hora
                    </Link>
                </div>

                <button className={styles.mobileToggle} aria-label="Menú">☰</button>
            </div>
        </nav>
    );
}
