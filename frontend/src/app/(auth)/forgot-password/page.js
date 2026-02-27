'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../auth.module.css';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: email, 2: code + new password, 3: done
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authAPI.forgotPassword({ email });
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            await authAPI.resetPassword({ email, code, newPassword });
            setStep(3);
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

                {step === 1 && (
                    <>
                        <h1 className={styles.authTitle}>Recuperar contraseña</h1>
                        <p className={styles.authSubtitle}>Ingresa tu email y te enviaremos un código de verificación</p>

                        {error && <div className={styles.errorMsg}>{error}</div>}

                        <form onSubmit={handleSendCode}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Email</label>
                                <input type="email" className={styles.formInput}
                                    placeholder="tu@email.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h1 className={styles.authTitle}>Ingresa el código</h1>
                        <p className={styles.authSubtitle}>
                            Revisa la consola del servidor o tu email para obtener el código de 6 dígitos
                        </p>

                        {error && <div className={styles.errorMsg}>{error}</div>}

                        <form onSubmit={handleResetPassword}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Código de verificación</label>
                                <input type="text" className={styles.formInput}
                                    placeholder="123456" maxLength={6}
                                    value={code} onChange={(e) => setCode(e.target.value)} required
                                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em', fontWeight: 700 }} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Nueva contraseña</label>
                                <input type="password" className={styles.formInput}
                                    placeholder="••••••••"
                                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Confirmar contraseña</label>
                                <input type="password" className={styles.formInput}
                                    placeholder="••••••••"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                            </button>
                        </form>

                        <p className={styles.authLink} style={{ marginTop: '16px' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setStep(1); setError(''); }}>
                                ← Reenviar código
                            </a>
                        </p>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                            <h1 className={styles.authTitle}>¡Contraseña actualizada!</h1>
                            <p className={styles.authSubtitle}>Ya puedes ingresar con tu nueva contraseña</p>
                        </div>

                        <Link href="/login" className={styles.submitBtn}
                            style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            Ir al login
                        </Link>
                    </>
                )}

                {step !== 3 && (
                    <p className={styles.authLink}>
                        <Link href="/login">← Volver al login</Link>
                    </p>
                )}
            </div>
        </div>
    );
}
