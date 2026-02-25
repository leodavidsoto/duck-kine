'use client';

import { useEffect, useState } from 'react';
import s from '../admin.module.css';
import { adminAPI } from '@/lib/api';

export default function PacientesPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => { loadPatients(); }, []);

    const loadPatients = async (q) => {
        setLoading(true);
        try {
            const data = await adminAPI.getPatients({ search: q || search, limit: 50 });
            setPatients(data.patients || []);
        } catch { }
        finally { setLoading(false); }
    };

    const openDetail = async (patientId) => {
        setDetailLoading(true);
        setActiveTab('info');
        try {
            const data = await adminAPI.getPatientFull(patientId);
            setSelectedPatient(data);
        } catch (err) { alert(err.message); }
        finally { setDetailLoading(false); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadPatients(search);
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const fmtMoney = (v) => `$${Number(v || 0).toLocaleString('es-CL')}`;

    // ─── Detail view ────────────────────────────
    if (selectedPatient) {
        const p = selectedPatient;
        const u = p.user;
        const initials = `${(u.firstName || '')[0] || ''}${(u.lastName || '')[0] || ''}`.toUpperCase();

        const tabs = [
            { key: 'info', label: 'Datos' },
            { key: 'citas', label: `Citas (${p.appointments?.length || 0})` },
            { key: 'dolor', label: `Dolor (${p.painRecords?.length || 0})` },
            { key: 'fichas', label: `Fichas (${p.clinicalRecords?.length || 0})` },
            { key: 'pagos', label: `Pagos (${p.payments?.length || 0})` },
        ];

        return (
            <>
                <button className={s.actionBtn} onClick={() => setSelectedPatient(null)}
                    style={{ marginBottom: 'var(--space-4)' }}>← Volver a lista</button>

                <div className={s.detailHeader}>
                    <div className={s.detailAvatar}>{initials}</div>
                    <div>
                        <div className={s.detailName}>{u.firstName} {u.lastName}</div>
                        <div className={s.detailSub}>{u.rut} · {u.email} · {u.phone || 'Sin teléfono'}</div>
                        <div className={s.detailSub}>Paciente desde {fmtDate(u.createdAt)}</div>
                    </div>
                </div>

                <div className={s.tabs}>
                    {tabs.map(t => (
                        <button key={t.key}
                            className={`${s.tab} ${activeTab === t.key ? s.tabActive : ''}`}
                            onClick={() => setActiveTab(t.key)}>{t.label}</button>
                    ))}
                </div>

                {/* Info tab */}
                {activeTab === 'info' && (
                    <div className={s.grid2}>
                        <div className={s.card}>
                            <h3 className={s.cardTitle}>Datos personales</h3>
                            <InfoRow label="Previsión" value={p.prevision || '—'} />
                            <InfoRow label="Ocupación" value={p.occupation || '—'} />
                            <InfoRow label="Deporte" value={p.sport || '—'} />
                            <InfoRow label="Actividad" value={p.activityLevel || '—'} />
                            <InfoRow label="Dirección" value={p.address || '—'} />
                            <InfoRow label="Comuna" value={p.commune || '—'} />
                        </div>
                        <div className={s.card}>
                            <h3 className={s.cardTitle}>Antecedentes médicos</h3>
                            <InfoRow label="Historial" value={p.medicalHistory || 'Sin registros'} />
                            <InfoRow label="Cirugías" value={p.surgicalHistory || 'Sin registros'} />
                            <InfoRow label="Alergias" value={p.allergies || 'Ninguna'} />
                            <InfoRow label="Medicamentos" value={p.medications || 'Ninguno'} />
                            <InfoRow label="Tabaquismo" value={p.smokingStatus || '—'} />
                        </div>
                    </div>
                )}

                {/* Citas tab */}
                {activeTab === 'citas' && (
                    <div className={s.card}>
                        {(p.appointments?.length || 0) === 0 ? (
                            <p style={{ color: 'var(--text-tertiary)' }}>Sin citas registradas</p>
                        ) : (
                            <table className={s.table}>
                                <thead><tr><th>Fecha</th><th>Servicio</th><th>Profesional</th><th>Estado</th></tr></thead>
                                <tbody>
                                    {p.appointments.map(apt => (
                                        <tr key={apt.id}>
                                            <td style={{ fontWeight: 600 }}>{fmtDate(apt.startTime)}</td>
                                            <td>{apt.service?.name || '—'}</td>
                                            <td style={{ color: 'var(--text-tertiary)' }}>
                                                {apt.professional?.user ? `${apt.professional.user.firstName} ${apt.professional.user.lastName}` : '—'}
                                            </td>
                                            <td><span className={`badge badge-${apt.status === 'COMPLETED' ? 'success' : apt.status === 'CANCELLED' ? 'error' : 'warning'}`}>
                                                {apt.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Dolor tab */}
                {activeTab === 'dolor' && (
                    <div className={s.card}>
                        {(p.painRecords?.length || 0) === 0 ? (
                            <p style={{ color: 'var(--text-tertiary)' }}>Sin registros de dolor</p>
                        ) : (
                            <table className={s.table}>
                                <thead><tr><th>Fecha</th><th>EVA</th><th>Ubicación</th><th>Contexto</th></tr></thead>
                                <tbody>
                                    {p.painRecords.map((r, i) => (
                                        <tr key={i}>
                                            <td>{fmtDate(r.recordedAt)}</td>
                                            <td style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: r.evaScore <= 3 ? 'var(--success-500)' : r.evaScore <= 6 ? 'var(--warning-500)' : 'var(--error-500)' }}>
                                                {r.evaScore}/10
                                            </td>
                                            <td>{r.location}</td>
                                            <td style={{ color: 'var(--text-tertiary)' }}>{r.context || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Fichas tab */}
                {activeTab === 'fichas' && (
                    <div className={s.card}>
                        {(p.clinicalRecords?.length || 0) === 0 ? (
                            <p style={{ color: 'var(--text-tertiary)' }}>Sin fichas clínicas</p>
                        ) : (
                            <div className={s.timeline}>
                                {p.clinicalRecords.map((rec, i) => (
                                    <div key={i} className={s.timelineItem}>
                                        <div className={s.timelineDot} />
                                        <div className={s.timelineDate}>{fmtDate(rec.createdAt)}</div>
                                        <div className={s.timelineTitle}>{rec.diagnosis || 'Ficha clínica'}</div>
                                        <div className={s.timelineDesc}>{rec.treatment || rec.observations || ''}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pagos tab */}
                {activeTab === 'pagos' && (
                    <div className={s.card}>
                        {(p.payments?.length || 0) === 0 ? (
                            <p style={{ color: 'var(--text-tertiary)' }}>Sin pagos registrados</p>
                        ) : (
                            <table className={s.table}>
                                <thead><tr><th>Fecha</th><th>Concepto</th><th>Monto</th><th>Estado</th></tr></thead>
                                <tbody>
                                    {p.payments.map((pay, i) => (
                                        <tr key={i}>
                                            <td>{fmtDate(pay.paidAt || pay.createdAt)}</td>
                                            <td>{pay.appointment?.service?.name || pay.description || 'Pago'}</td>
                                            <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fmtMoney(pay.totalAmount)}</td>
                                            <td><span className={`badge badge-${pay.status === 'APPROVED' ? 'success' : 'warning'}`}>{pay.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </>
        );
    }

    // ─── List view ──────────────────────────────
    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>👥 Pacientes</h1>
                <p className={s.pageDesc}>Gestiona tus pacientes y sus fichas</p>
            </div>

            <form onSubmit={handleSearch} className={s.searchBar}>
                <input type="text" className={s.searchInput}
                    placeholder="Buscar por nombre, apellido o RUT..."
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                <button type="submit" className="btn btn-primary">Buscar</button>
            </form>

            <div className={s.card}>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)' }}>Cargando pacientes...</p>
                ) : patients.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>👥</div>
                        <div className={s.emptyTitle}>Sin pacientes</div>
                        <p className={s.emptyDesc}>{search ? 'No se encontraron resultados.' : 'Los pacientes aparecerán aquí cuando se registren.'}</p>
                    </div>
                ) : (
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>RUT</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Registrado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600 }}>{p.user?.firstName} {p.user?.lastName}</td>
                                    <td style={{ color: 'var(--text-tertiary)' }}>{p.user?.rut || '—'}</td>
                                    <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>{p.user?.email}</td>
                                    <td style={{ color: 'var(--text-tertiary)' }}>{p.user?.phone || '—'}</td>
                                    <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>{fmtDate(p.createdAt)}</td>
                                    <td>
                                        <button className={`${s.actionBtn} ${s.actionBtnPrimary}`}
                                            onClick={() => openDetail(p.id)}>Ver ficha →</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem',
        }}>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>
            <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
        </div>
    );
}
