'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import s from '../checkout.module.css';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const paymentStatus = searchParams.get('status');
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        if (paymentStatus === 'success' && paymentId) {
            setStatus('success');
        } else if (paymentStatus === 'aborted') {
            setStatus('aborted');
        } else if (paymentStatus === 'error' || paymentStatus === 'rejected') {
            setStatus('error');
        } else if (paymentId) {
            setStatus('success'); // Fallback for old mock code
        } else {
            setStatus('error');
        }
    }, [paymentId, paymentStatus]);

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

                            <div style={{ marginTop: '2rem' }}>
                                <Link href="/dashboard/" className="btn btn-primary btn-lg">
                                    Ir a mi Dashboard
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === 'aborted' && (
                        <div className={s.stateError}>
                            <div className={s.iconError}>⚠</div>
                            <h1 className={s.titleError}>Pago Anulado</h1>
                            <p className={s.descText}>
                                El pago fue cancelado. Si deseas intentar nuevamente, puedes volver a agendar.
                            </p>
                            <div style={{ marginTop: '2rem' }}>
                                <Link href="/reservar/" className="btn btn-primary btn-lg">
                                    Reservar ahora
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className={s.stateError}>
                            <div className={s.iconError}>✗</div>
                            <h1 className={s.titleError}>Pago Rechazado</h1>
                            <p className={s.descText}>
                                Hubo un problema al procesar tu pago. Por favor, intenta de nuevo o contacta con tu banco.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                                <Link href="/reservar/" className="btn btn-secondary btn-lg">
                                    Volver a intentar
                                </Link>
                                <Link href="/contacto/" className="btn btn-outline-primary btn-lg">
                                    Contactar soporte
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
