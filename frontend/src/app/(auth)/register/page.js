'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../auth.module.css';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '',
        rut: '', phone: '', password: '', confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            const { confirmPassword, ...userData } = form;
            const { user, token } = await authAPI.register(userData);
            localStorage.setItem('dk_token', token);
            localStorage.setItem('dk_user', JSON.stringify(user));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authLogo}>
                    <div className={styles.authLogoMark}><img src="/assets/images/logo.png" alt="Duck" /></div>
                    <div className={styles.authLogoText}>Duck <span>Kine</span></div>
                </div>

                <h1 className={styles.authTitle}>Crea tu cuenta</h1>
                <p className={styles.authSubtitle}>Regístrate para agendar tu primera evaluación</p>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Nombre</label>
                            <input id="reg-fn" type="text" className={styles.formInput}
                                placeholder="Juan" value={form.firstName} onChange={update('firstName')} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Apellido</label>
                            <input id="reg-ln" type="text" className={styles.formInput}
                                placeholder="Pérez" value={form.lastName} onChange={update('lastName')} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>RUT</label>
                        <input id="reg-rut" type="text" className={styles.formInput}
                            placeholder="12.345.678-9" value={form.rut} onChange={update('rut')} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input id="reg-email" type="email" className={styles.formInput}
                            placeholder="tu@email.com" value={form.email} onChange={update('email')} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Teléfono <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(opcional)</span></label>
                        <input id="reg-phone" type="tel" className={styles.formInput}
                            placeholder="+56 9 1234 5678" value={form.phone} onChange={update('phone')} />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Contraseña</label>
                            <input id="reg-pw" type="password" className={styles.formInput}
                                placeholder="Mín. 8 caracteres" value={form.password} onChange={update('password')} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Confirmar</label>
                            <input id="reg-cpw" type="password" className={styles.formInput}
                                placeholder="Repetir" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                        </div>
                    </div>

                    <button id="reg-submit" type="submit"
                        className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className={styles.authLink}>
                    ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
