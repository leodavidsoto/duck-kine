'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import s from '../checkout.module.css';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const [status, setStatus] = useState('loading');

    // In a real scenario, this would poll or check the payment status against the backend
    // using the paymentId. For this MVP, we simulate a successful confirmation.
    useEffect(() => {
        if (paymentId) {
            setTimeout(() => {
                setStatus('success');
            }, 1500);
        } else {
            setStatus('error');
        }
    }, [paymentId]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-subtle)' }}>
            <Navbar />

            <main className={`${s.checkoutContainer} container`}>
                <div className={s.resultCard}>
                    {status === 'loading' && (
                        <div className={s.stateLoading}>
                            <div className={s.spinner}></div>
                            <h2>Confirmando tu pago...</h2>
                            <p>Por favor, no cierres esta ventana.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className={s.stateSuccess}>
                            <div className={s.iconSuccess}>✓</div>
                            <h1 className={s.titleSuccess}>¡Cita Confirmada!</h1>
                            <p className={s.descText}>
                                Hemos recibido tu pago exitosamente. Tu reserva de hora está confirmada y hemos enviado un comprobante a tu correo electrónico.
                            </p>

                            <div className={s.receiptBox}>
                                <div className={s.receiptRow}>
                                    <span>Nº de Transacción:</span>
                                    <strong>{paymentId || 'TXN-12345678'}</strong>
                                </div>
                                <div className={s.receiptRow}>
                                    <span>Estado:</span>
                                    <strong style={{ color: 'var(--success-600)' }}>PAGADO</strong>
                                </div>
                            </div>

                            <div className={s.actionRow}>
                                <Link href="/dashboard" className="btn btn-primary btn-lg">
                                    Ir a mi Dashboard
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className={s.stateError}>
                            <div className={s.iconError}>✗</div>
                            <h1 className={s.titleError}>Error en la confirmación</h1>
                            <p className={s.descText}>
                                No pudimos validar tu código de transacción. Si realizaste el pago y crees que esto es un error, por favor contáctanos con tu comprobante.
                            </p>
                            <div className={s.actionRow}>
                                <Link href="/reservar" className="btn btn-secondary btn-lg">
                                    Volver a intentar
                                </Link>
                                <Link href="/contacto" className="btn btn-outline-primary btn-lg">
                                    Soporte
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className={s.spinner}></div></div>}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
