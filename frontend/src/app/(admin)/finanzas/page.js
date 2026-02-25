'use client';

import { useEffect, useState } from 'react';
import s from '../admin.module.css';
import { adminAPI } from '@/lib/api';

export default function FinanzasPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadRevenue(); }, []);

    const loadRevenue = async () => {
        try {
            const d = await adminAPI.getRevenue();
            setData(d);
        } catch { }
        finally { setLoading(false); }
    };

    const fmtMoney = (v) => `$${Number(v || 0).toLocaleString('es-CL')}`;
    const fmtDate = (d) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

    const methodMap = {
        WEBPAY: 'Webpay',
        TRANSFER: 'Transferencia',
        CASH: 'Efectivo',
        SUBSCRIPTION: 'Suscripción',
        CORPORATE: 'Corporativo',
    };

    const statusMap = {
        PENDING: { label: 'Pendiente', color: 'warning' },
        APPROVED: { label: 'Pagado', color: 'success' },
        REJECTED: { label: 'Rechazado', color: 'error' },
        REFUNDED: { label: 'Reembolsado', color: 'info' },
    };

    const growth = data && data.prevMonth.total > 0
        ? Math.round(((data.thisMonth.total - data.prevMonth.total) / data.prevMonth.total) * 100)
        : null;

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>💰 Finanzas</h1>
                <p className={s.pageDesc}>Resumen de ingresos y transacciones</p>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-tertiary)' }}>Cargando datos financieros...</p>
            ) : !data ? (
                <p style={{ color: 'var(--text-tertiary)' }}>Error al cargar datos</p>
            ) : (
                <>
                    {/* KPIs */}
                    <div className={s.kpiRow}>
                        <div className={s.kpiCard}>
                            <span className={s.kpiIcon}>💰</span>
                            <span className={s.kpiValue}>{fmtMoney(data.thisMonth.total)}</span>
                            <span className={s.kpiLabel}>Ingresos este mes</span>
                        </div>
                        <div className={s.kpiCard}>
                            <span className={s.kpiIcon}>📋</span>
                            <span className={s.kpiValue}>{data.thisMonth.count}</span>
                            <span className={s.kpiLabel}>Transacciones mes</span>
                        </div>
                        <div className={s.kpiCard}>
                            <span className={s.kpiIcon}>📊</span>
                            <span className={s.kpiValue} style={{ color: growth !== null && growth >= 0 ? 'var(--success-500)' : 'var(--error-500)' }}>
                                {growth !== null ? `${growth >= 0 ? '+' : ''}${growth}%` : '—'}
                            </span>
                            <span className={s.kpiLabel}>vs mes anterior</span>
                        </div>
                        <div className={s.kpiCard}>
                            <span className={s.kpiIcon}>📅</span>
                            <span className={s.kpiValue}>{fmtMoney(data.prevMonth.total)}</span>
                            <span className={s.kpiLabel}>Mes anterior</span>
                        </div>
                    </div>

                    {/* Revenue by method */}
                    {data.byMethod.length > 0 && (
                        <div className={s.card}>
                            <h3 className={s.cardTitle}>Ingresos por método de pago</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.byMethod.length, 4)}, 1fr)`, gap: 'var(--space-3)' }}>
                                {data.byMethod.map((m, i) => (
                                    <div key={i} className={s.miniStat}>
                                        <span className={s.miniStatValue}>{fmtMoney(m._sum.totalAmount)}</span>
                                        <span className={s.miniStatLabel}>{methodMap[m.method] || m.method} ({m._count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent payments */}
                    <div className={s.card}>
                        <h3 className={s.cardTitle}>Últimas transacciones</h3>
                        {data.recentPayments.length === 0 ? (
                            <div className={s.emptyState}>
                                <div className={s.emptyIcon}>💳</div>
                                <div className={s.emptyTitle}>Sin transacciones</div>
                                <p className={s.emptyDesc}>Las transacciones aparecerán aquí.</p>
                            </div>
                        ) : (
                            <table className={s.table}>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Paciente</th>
                                        <th>Concepto</th>
                                        <th>Método</th>
                                        <th>Monto</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentPayments.map((p) => {
                                        const st = statusMap[p.status] || { label: p.status, color: 'default' };
                                        const pName = p.patient?.user ? `${p.patient.user.firstName} ${p.patient.user.lastName}` : '—';
                                        return (
                                            <tr key={p.id}>
                                                <td>{fmtDate(p.paidAt || p.createdAt)}</td>
                                                <td style={{ fontWeight: 600 }}>{pName}</td>
                                                <td style={{ color: 'var(--text-tertiary)' }}>{p.appointment?.service?.name || p.description || 'Pago'}</td>
                                                <td style={{ color: 'var(--text-tertiary)' }}>{methodMap[p.method] || p.method}</td>
                                                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fmtMoney(p.totalAmount)}</td>
                                                <td><span className={`badge badge-${st.color}`}>{st.label}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
