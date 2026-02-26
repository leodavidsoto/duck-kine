'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../auth.module.css';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { user, token } = await authAPI.login(form);
            localStorage.setItem('dk_token', token);
            localStorage.setItem('dk_user', JSON.stringify(user));
            const adminRoles = ['PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN', 'ORG_ADMIN', 'CLINIC_DIRECTOR'];
            window.location.href = adminRoles.includes(user.role) ? '/admin' : '/dashboard';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authLogo}>
                    <div className={styles.authLogoMark}><img src="/assets/images/logo.png" alt="Duck" /></div>
                    <div className={styles.authLogoText}>Duck <span>Kine</span></div>
                </div>

                <h1 className={styles.authTitle}>Bienvenido de vuelta</h1>
                <p className={styles.authSubtitle}>Ingresa para ver tu historial y agenda</p>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input id="login-email" type="email" className={styles.formInput}
                            placeholder="tu@email.com"
                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Contraseña</label>
                        <input id="login-password" type="password" className={styles.formInput}
                            placeholder="••••••••"
                            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                        <a href="/forgot-password" className={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
                    </div>

                    <button id="login-submit" type="submit"
                        className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <p className={styles.authLink}>
                    ¿Primera vez? <Link href="/register">Crea tu cuenta</Link>
                </p>
            </div>
        </div>
    );
}
