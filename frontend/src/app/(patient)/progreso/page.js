'use client';

import { useEffect, useState } from 'react';
import s from '../patient.module.css';
import { patientsAPI } from '@/lib/api';

export default function ProgresoPage() {
    const [goals, setGoals] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [g, a] = await Promise.allSettled([
                patientsAPI.getGoals(),
                patientsAPI.getAssessments(),
            ]);
            if (g.status === 'fulfilled') setGoals(g.value.goals || []);
            if (a.status === 'fulfilled') setAssessments(a.value.assessments || []);
        } catch { setError('Error al cargar progreso'); }
        finally { setLoading(false); }
    };

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>📈 Mi Progreso</h1>
                <p className={s.pageDesc}>Sigue la evolución de tu tratamiento</p>
            </div>

            {/* Stats Summary */}
            <div className={s.grid3}>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>🎯</div>
                    <span className={s.miniStatValue}>{goals.filter(g => g.isAchieved).length}/{goals.length}</span>
                    <span className={s.miniStatLabel}>Metas logradas</span>
                </div>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>📊</div>
                    <span className={s.miniStatValue}>{assessments.length}</span>
                    <span className={s.miniStatLabel}>Evaluaciones</span>
                </div>
                <div className={s.miniStat}>
                    <div className={s.miniStatIcon}>📈</div>
                    <span className={s.miniStatValue}>
                        {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + Number(g.progressPercent || 0), 0) / goals.length) : 0}%
                    </span>
                    <span className={s.miniStatLabel}>Progreso promedio</span>
                </div>
            </div>

            {/* Goals */}
            <div className={s.card} style={{ marginTop: 'var(--space-6)' }}>
                <h3 className={s.cardTitle}>🎯 Objetivos terapéuticos</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Cargando...</p>
                ) : error ? (
                    <p style={{ color: 'var(--error-500, #f87171)', fontSize: '0.875rem' }}>{error}</p>
                ) : goals.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>🎯</div>
                        <div className={s.emptyTitle}>Sin objetivos definidos</div>
                        <p className={s.emptyDesc}>Tus objetivos serán definidos por tu kinesiólogo durante la evaluación inicial.</p>
                    </div>
                ) : (
                    goals.map((goal, i) => (
                        <div key={i} style={{ padding: 'var(--space-4) 0', borderBottom: i < goals.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem' }}>
                                    {goal.isAchieved ? '✅' : '🔵'} {goal.title}
                                </span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary-600)' }}>
                                    {Number(goal.progressPercent || 0).toFixed(0)}%
                                </span>
                            </div>
                            {goal.description && (
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
                                    {goal.description}
                                </p>
                            )}
                            <div className={s.progressBar}>
                                <div className={s.progressFill} style={{ width: `${goal.progressPercent || 0}%` }} />
                            </div>
                            {goal.targetValue && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                                    Meta: {goal.targetValue} {goal.currentValue ? `· Actual: ${goal.currentValue}` : ''}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Assessments */}
            <div className={s.card}>
                <h3 className={s.cardTitle}>🩺 Evaluaciones físicas</h3>
                {assessments.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>🩺</div>
                        <div className={s.emptyTitle}>Sin evaluaciones</div>
                        <p className={s.emptyDesc}>Las evaluaciones se registrarán al inicio, durante y al final de tu tratamiento.</p>
                    </div>
                ) : (
                    <div className={s.timeline}>
                        {assessments.map((a, i) => (
                            <div key={i} className={s.timelineItem}>
                                <div className={s.timelineDot} />
                                <div className={s.timelineDate}>
                                    {new Date(a.assessmentDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                                </div>
                                <div className={s.timelineTitle}>
                                    {a.type === 'INITIAL' ? 'Evaluación inicial' : a.type === 'FOLLOW_UP' ? 'Control' : a.type === 'DISCHARGE' ? 'Alta' : 'Evaluación'}
                                    {a.overallScore ? ` — ${Number(a.overallScore).toFixed(0)}/100` : ''}
                                </div>
                                {a.summary && <div className={s.timelineDesc}>{a.summary}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
