'use client';

import { useEffect, useState } from 'react';
import s from '../patient.module.css';
import { patientsAPI } from '@/lib/api';

export default function EjerciciosPage() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadExercises(); }, []);

    const loadExercises = async () => {
        try {
            const data = await patientsAPI.getExercises();
            setExercises(data.exercises || data || []);
        } catch { }
        finally { setLoading(false); }
    };

    // Sample exercise library (shown when no assigned exercises)
    const sampleExercises = [
        { name: 'Sentadilla isométrica', muscle: 'Cuádriceps', sets: 3, reps: '30s', icon: '🦵', difficulty: 'Fácil' },
        { name: 'Puente glúteo', muscle: 'Glúteos / Core', sets: 3, reps: '15', icon: '🍑', difficulty: 'Fácil' },
        { name: 'Estiramiento isquiotibiales', muscle: 'Isquiotibiales', sets: 2, reps: '30s', icon: '🧘', difficulty: 'Fácil' },
        { name: 'Plancha frontal', muscle: 'Core', sets: 3, reps: '30s', icon: '💪', difficulty: 'Moderado' },
        { name: 'Elevación talones', muscle: 'Gemelos', sets: 3, reps: '20', icon: '🦶', difficulty: 'Fácil' },
        { name: 'Flexión cadera con banda', muscle: 'Flexores cadera', sets: 3, reps: '12', icon: '🏋️', difficulty: 'Moderado' },
    ];

    const displayed = exercises.length > 0 ? exercises : sampleExercises;

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>💪 Mis Ejercicios</h1>
                <p className={s.pageDesc}>
                    {exercises.length > 0
                        ? 'Ejercicios asignados por tu kinesiólogo'
                        : 'Tu biblioteca de ejercicios — serán personalizados después de tu evaluación'}
                </p>
            </div>

            <div className={s.grid2}>
                {displayed.map((ex, i) => (
                    <div key={i} className={s.card} style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                            <span style={{ fontSize: '1.75rem' }}>{ex.icon || '💪'}</span>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem' }}>
                                    {ex.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                    {ex.muscle || ex.zone || ''}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                            <Tag label="Series" value={ex.sets || '3'} />
                            <Tag label="Reps" value={ex.reps || '12'} />
                            <Tag label="Nivel" value={ex.difficulty || 'Moderado'} />
                        </div>

                        {ex.notes && (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-3)' }}>
                                ℹ️ {ex.notes}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

function Tag({ label, value }) {
    return (
        <div style={{
            background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)',
            padding: '0.375rem 0.75rem', flex: 1, textAlign: 'center',
        }}>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9375rem' }}>
                {value}
            </div>
        </div>
    );
}
