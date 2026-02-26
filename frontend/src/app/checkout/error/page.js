'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import s from '../checkout.module.css';

function CheckoutErrorContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || 'RECHAZADO';

    const getErrorMessage = () => {
        if (reason === 'FONDOS_INSUFICIENTES') return 'Tu tarjeta no tiene fondos suficientes para completar esta transacción.';
        if (reason === 'CANCELADO') return 'Has cancelado el proceso de pago en el gateway.';
        return 'Tu transacción ha sido rechazada por el medio de pago o el banco emisor.';
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-subtle)' }}>
            <Navbar />

            <main className={`${s.checkoutContainer} container`}>
                <div className={s.resultCard}>
                    <div className={s.stateError}>
                        <div className={s.iconError}>!</div>
                        <h1 className={s.titleError}>Pago Rechazado</h1>
                        <p className={s.descText}>
                            {getErrorMessage()}
                        </p>

                        <div className={s.receiptBox} style={{ backgroundColor: 'var(--error-50)', borderColor: 'var(--error-200)' }}>
                            <p style={{ color: 'var(--error-700)', margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>
                                Tu cita <strong>no</strong> ha sido confirmada ni cobrada. Puedes intentar con otro medio de pago.
                            </p>
                        </div>

                        <div className={s.actionRow}>
                            <Link href="/reservar" className="btn btn-primary btn-lg">
                                Volver a Reservar
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutErrorPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className={s.spinner}></div></div>}>
            <CheckoutErrorContent />
        </Suspense>
    );
}
