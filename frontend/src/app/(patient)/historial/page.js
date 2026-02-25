'use client';

import { useEffect, useState } from 'react';
import s from '../patient.module.css';
import { clinicalAPI, patientsAPI } from '@/lib/api';

export default function HistorialPage() {
    const [profile, setProfile] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [prof, recs] = await Promise.allSettled([
                patientsAPI.getProfile(),
                clinicalAPI.getByPatient('me', {}),
            ]);
            if (prof.status === 'fulfilled') setProfile(prof.value.patient || prof.value);
            if (recs.status === 'fulfilled') setRecords(recs.value.records || recs.value || []);
        } catch { }
        finally { setLoading(false); }
    };

    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('dk_user') || '{}') : {};

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>📋 Mi Ficha Clínica</h1>
                <p className={s.pageDesc}>Tu información médica y registros de atención</p>
            </div>

            {/* Personal Info */}
            <div className={s.card}>
                <h3 className={s.cardTitle}>Datos personales</h3>
                <div className={s.grid2}>
                    <div>
                        <InfoRow label="Nombre" value={`${user.firstName || ''} ${user.lastName || ''}`} />
                        <InfoRow label="RUT" value={user.rut || '—'} />
                        <InfoRow label="Email" value={user.email || '—'} />
                        <InfoRow label="Teléfono" value={user.phone || '—'} />
                    </div>
                    <div>
                        <InfoRow label="Previsión" value={profile?.prevision || '—'} />
                        <InfoRow label="Ocupación" value={profile?.occupation || '—'} />
                        <InfoRow label="Deporte" value={profile?.sport || '—'} />
                        <InfoRow label="Nivel actividad" value={profile?.activityLevel || '—'} />
                    </div>
                </div>
            </div>

            {/* Medical History */}
            <div className={s.card}>
                <h3 className={s.cardTitle}>Antecedentes médicos</h3>
                <div className={s.grid2}>
                    <div>
                        <InfoRow label="Historial médico" value={profile?.medicalHistory || 'Sin registros'} />
                        <InfoRow label="Cirugías" value={profile?.surgicalHistory || 'Sin registros'} />
                    </div>
                    <div>
                        <InfoRow label="Alergias" value={profile?.allergies || 'Ninguna registrada'} />
                        <InfoRow label="Medicamentos" value={profile?.medications || 'Ninguno'} />
                    </div>
                </div>
            </div>

            {/* Clinical Records */}
            <div className={s.card}>
                <h3 className={s.cardTitle}>Registros clínicos</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Cargando...</p>
                ) : records.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>📋</div>
                        <div className={s.emptyTitle}>Sin registros clínicos</div>
                        <p className={s.emptyDesc}>Los registros aparecerán aquí después de tu primera sesión.</p>
                    </div>
                ) : (
                    <div className={s.timeline}>
                        {records.map((rec, i) => (
                            <div key={i} className={s.timelineItem}>
                                <div className={s.timelineDot} />
                                <div className={s.timelineDate}>
                                    {new Date(rec.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className={s.timelineTitle}>{rec.diagnosis || 'Sesión clínica'}</div>
                                <div className={s.timelineDesc}>{rec.treatment || rec.observations || ''}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)',
            fontSize: '0.875rem',
        }}>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>
            <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
        </div>
    );
}
