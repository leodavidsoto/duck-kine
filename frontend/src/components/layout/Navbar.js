'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
            <div className={styles.navInner}>
                <Link href="/" className={styles.logo}>
                    <img
                        src="/assets/images/logo.png"
                        alt="Duck Kinesiología"
                        className={styles.logoImg}
                    />
                    <span className={styles.logoText}>
                        Duck <span>Kine</span>
                    </span>
                </Link>

                <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
                    <li><Link href="/" className={styles.navLink}>Inicio</Link></li>
                    <li><Link href="/academia" className={styles.navLink}>Academia</Link></li>
                    <li><Link href="/corporativo" className={styles.navLink}>Empresas</Link></li>
                    <li><Link href="/reservar" className={styles.navLink}>Reservar</Link></li>
                </ul>

                <div className={styles.navActions}>
                    <Link href="/login" className={styles.loginLink}>
                        Iniciar sesión
                    </Link>
                    <Link href="/reservar" className={styles.ctaBtn}>
                        Agendar hora
                    </Link>
                </div>

                <button
                    className={styles.mobileToggle}
                    aria-label="Menú"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>
        </nav>
    );
}
