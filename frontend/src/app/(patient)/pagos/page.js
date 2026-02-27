'use client';

import { useEffect, useState } from 'react';
import s from '../patient.module.css';
import { paymentsAPI } from '@/lib/api';

export default function PagosPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadPayments(); }, []);

    const loadPayments = async () => {
        try {
            const data = await paymentsAPI.getMy({});
            setPayments(data.payments || data || []);
        } catch { setError('Error al cargar pagos'); }
        finally { setLoading(false); }
    };

    const statusMap = {
        PENDING: { label: 'Pendiente', color: 'warning' },
        APPROVED: { label: 'Pagado', color: 'success' },
        REJECTED: { label: 'Rechazado', color: 'error' },
        REFUNDED: { label: 'Reembolsado', color: 'info' },
    };

    const methodMap = {
        WEBPAY: 'Webpay',
        TRANSFER: 'Transferencia',
        CASH: 'Efectivo',
        SUBSCRIPTION: 'Suscripción',
        CORPORATE: 'Corporativo',
    };

    const fmtMoney = (v) => `$${Number(v || 0).toLocaleString('es-CL')}`;

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>💳 Mis Pagos</h1>
                <p className={s.pageDesc}>Historial de pagos y boletas</p>
            </div>

            {/* Summary */}
            <div className={s.grid3}>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>💰</div>
                    <span className={s.miniStatValue}>
                        {fmtMoney(payments.filter(p => p.status === 'APPROVED').reduce((a, p) => a + Number(p.totalAmount || 0), 0))}
                    </span>
                    <span className={s.miniStatLabel}>Total pagado</span>
                </div>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>📋</div>
                    <span className={s.miniStatValue}>{payments.length}</span>
                    <span className={s.miniStatLabel}>Transacciones</span>
                </div>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>⏳</div>
                    <span className={s.miniStatValue}>
                        {payments.filter(p => p.status === 'PENDING').length}
                    </span>
                    <span className={s.miniStatLabel}>Pendientes</span>
                </div>
            </div>

            {/* Payments List */}
            <div className={s.card} style={{ marginTop: 'var(--space-6)' }}>
                <h3 className={s.cardTitle}>📄 Historial de transacciones</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Cargando...</p>
                ) : error ? (
                    <p style={{ color: 'var(--error-500, #f87171)', fontSize: '0.875rem' }}>{error}</p>
                ) : payments.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>💳</div>
                        <div className={s.emptyTitle}>Sin pagos registrados</div>
                        <p className={s.emptyDesc}>Los pagos de tus sesiones aparecerán aquí.</p>
                    </div>
                ) : (
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Concepto</th>
                                <th>Método</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Boleta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p, i) => {
                                const st = statusMap[p.status] || { label: p.status, color: 'default' };
                                return (
                                    <tr key={i}>
                                        <td>{new Date(p.paidAt || p.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}</td>
                                        <td style={{ fontWeight: 600 }}>{p.description || p.concept || 'Sesión'}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{methodMap[p.method] || p.method}</td>
                                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                                            {fmtMoney(p.totalAmount)}
                                        </td>
                                        <td><span className={`badge badge-${st.color}`}>{st.label}</span></td>
                                        <td>
                                            {p.receiptUrl ? (
                                                <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer"
                                                    style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.8125rem' }}>
                                                    Ver boleta
                                                </a>
                                            ) : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
