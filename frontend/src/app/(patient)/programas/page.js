'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from '../patient.module.css';
import { sportsAPI } from '@/lib/api';

export default function ProgramasPage() {
    const [programs, setPrograms] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [progs, enrs] = await Promise.allSettled([
                sportsAPI.getAll({}),
                sportsAPI.getAll({ enrolled: true }),
            ]);
            if (progs.status === 'fulfilled') setPrograms(progs.value.programs || progs.value || []);
            if (enrs.status === 'fulfilled') setEnrollments(enrs.value.enrollments || enrs.value || []);
        } catch { setError('Error al cargar programas'); }
        finally { setLoading(false); }
    };

    const samplePrograms = [
        { name: 'Retorno al Running', sport: 'Running', level: 'INTERMEDIATE', durationWeeks: 8, sessionsPerWeek: 3, icon: '🏃', type: 'RETURN_TO_SPORT', price: 149990 },
        { name: 'Fuerza Funcional', sport: 'CrossFit', level: 'BEGINNER', durationWeeks: 12, sessionsPerWeek: 4, icon: '🏋️', type: 'SPORTS_PERFORMANCE', price: 179990 },
        { name: 'Rehabilitación Rodilla (LCA)', sport: 'General', level: 'BEGINNER', durationWeeks: 16, sessionsPerWeek: 3, icon: '🦵', type: 'POST_SURGICAL', price: 249990 },
        { name: 'Prevención de Lesiones', sport: 'Fútbol', level: 'INTERMEDIATE', durationWeeks: 6, sessionsPerWeek: 2, icon: '⚽', type: 'PREVENTION', price: 99990 },
        { name: 'Core & Postura', sport: 'Wellness', level: 'BEGINNER', durationWeeks: 8, sessionsPerWeek: 3, icon: '🧘', type: 'CHRONIC_PAIN', price: 129990 },
        { name: 'Alto Rendimiento Trail', sport: 'Trail Running', level: 'ADVANCED', durationWeeks: 12, sessionsPerWeek: 5, icon: '⛰️', type: 'SPORTS_PERFORMANCE', price: 299990 },
    ];

    const displayed = programs.length > 0 ? programs : samplePrograms;

    const levelLabel = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado', ELITE: 'Élite' };
    const typeLabel = {
        REHABILITATION: 'Rehabilitación', SPORTS_PERFORMANCE: 'Rendimiento',
        PREVENTION: 'Prevención', POST_SURGICAL: 'Post-quirúrgico',
        CHRONIC_PAIN: 'Dolor crónico', RETURN_TO_SPORT: 'Retorno deportivo',
    };


    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>🏃 Programas Deportivos</h1>
                <p className={s.pageDesc}>Programas personalizados de rehabilitación y rendimiento deportivo</p>
            </div>

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
            <div className={s.grid2}>
                {displayed.map((prog, i) => (
                    <div key={i} className={s.card} style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                            <span style={{ fontSize: '2rem' }}>{prog.icon || '🏃'}</span>
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

                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                            <InfoPill icon="📅" value={`${prog.durationWeeks} semanas`} />
                            <InfoPill icon="💪" value={`${prog.sessionsPerWeek}x/sem`} />
                            <InfoPill icon="🏅" value={prog.sport} />
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)',
                            textAlign: 'right',
                        }}>
                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                                Inscribirme
                            </button>
                        </div>
                    </div>
                ))}
            </div>
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
