'use client';

import { useEffect, useState } from 'react';
import s from '../patient.module.css';
import { sportsAPI } from '@/lib/api';

export default function ProgramasPage() {
    const [programs, setPrograms] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [progs, enrs] = await Promise.allSettled([
                sportsAPI.getAll({}),
                sportsAPI.getAll({ enrolled: true }),
            ]);
            if (progs.status === 'fulfilled') setPrograms(progs.value.programs || progs.value || []);
            if (enrs.status === 'fulfilled') setEnrollments(enrs.value.enrollments || enrs.value || []);
        } catch { }
        finally { setLoading(false); }
    };

    const handleEnroll = async (programId) => {
        const token = localStorage.getItem('dk_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setEnrolling(programId);
        setMessage(null);
        try {
            await sportsAPI.enroll(programId);
            setMessage({ type: 'success', text: '¡Inscripción exitosa! Bienvenido al programa.' });
            loadData();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally { setEnrolling(null); }
    };

    const levelLabel = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado', ELITE: 'Élite' };
    const typeLabel = {
        REHABILITATION: 'Rehabilitación', SPORTS_PERFORMANCE: 'Rendimiento',
        PREVENTION: 'Prevención', POST_SURGICAL: 'Post-quirúrgico',
        CHRONIC_PAIN: 'Dolor crónico', RETURN_TO_SPORT: 'Retorno deportivo',
    };

    const iconMap = {
        Running: '🏃', CrossFit: '🏋️', General: '🦵', Fútbol: '⚽',
        Wellness: '🧘', 'Trail Running': '⛰️',
    };

    if (loading) return <div className={s.pageHeader}><p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando programas...</p></div>;

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>🏃 Programas Deportivos</h1>
                <p className={s.pageDesc}>Programas personalizados de rehabilitación y rendimiento deportivo</p>
            </div>

            {message && (
                <div style={{
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
                    background: message.type === 'success' ? 'rgba(46,204,154,0.15)' : 'rgba(255,107,107,0.15)',
                    color: message.type === 'success' ? '#2ECC9A' : '#ff6b6b',
                    fontWeight: 600, fontSize: '0.875rem',
                }}>
                    {message.text}
                </div>
            )}

            {/* Active Enrollments */}
            {enrollments.length > 0 && (
                <div className={s.card}>
                    <h3 className={s.cardTitle}>📋 Mis programas activos</h3>
                    {enrollments.map((en, i) => (
                        <div key={i} style={{ padding: 'var(--space-4) 0', borderBottom: i < enrollments.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                                    {en.program?.name || 'Programa'}
                                </span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary-600)' }}>
                                    Semana {en.currentWeek}
                                </span>
                            </div>
                            <div className={s.progressBar}>
                                <div className={s.progressFill} style={{ width: `${en.completionPercentage || 0}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Available Programs */}
            {programs.length === 0 ? (
                <div className={s.card}>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏃</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>
                            Próximamente
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Estamos preparando programas deportivos para ti. ¡Vuelve pronto!
                        </p>
                    </div>
                </div>
            ) : (
                <div className={s.grid2}>
                    {programs.map((prog) => (
                        <div key={prog.id} className={s.card} style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontSize: '2rem' }}>{iconMap[prog.sport] || '🏃'}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
                                        {prog.name}
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                                        <span className="badge badge-primary" style={{ fontSize: '0.625rem' }}>
                                            {typeLabel[prog.type] || prog.type}
                                        </span>
                                        <span className="badge" style={{ fontSize: '0.625rem', background: 'var(--bg-subtle)' }}>
                                            {levelLabel[prog.level] || prog.level}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {prog.description && (
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
                                    {prog.description}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <InfoPill icon="📅" value={`${prog.durationWeeks} semanas`} />
                                <InfoPill icon="💪" value={`${prog.sessionsPerWeek}x/sem`} />
                                <InfoPill icon="🏅" value={prog.sport} />
                            </div>

                            <div style={{
                                borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)',
                                textAlign: 'right',
                            }}>
                                <button className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                                    onClick={() => handleEnroll(prog.id)}
                                    disabled={enrolling === prog.id}>
                                    {enrolling === prog.id ? 'Inscribiendo...' : 'Inscribirme'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

function InfoPill({ icon, value }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--text-secondary)',
        }}>
            <span>{icon}</span> {value}
        </div>
    );
}
