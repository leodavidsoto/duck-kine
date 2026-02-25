'use client';

import { useEffect, useState } from 'react';
import s from '../patient.module.css';
import { patientsAPI } from '@/lib/api';

export default function DolorPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ evaScore: 3, location: '', context: '', notes: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadRecords(); }, []);

    const loadRecords = async () => {
        try {
            const data = await patientsAPI.getPainRecords();
            setRecords(data.records || []);
        } catch { }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await patientsAPI.createPainRecord({
                ...form,
                painLevel: getLevel(form.evaScore),
            });
            setShowForm(false);
            setForm({ evaScore: 3, location: '', context: '', notes: '' });
            loadRecords();
        } catch (err) {
            alert(err.message);
        } finally { setSaving(false); }
    };

    const getLevel = (score) => {
        if (score === 0) return 'NONE';
        if (score <= 3) return 'MILD';
        if (score <= 6) return 'MODERATE';
        if (score <= 8) return 'SEVERE';
        return 'EXTREME';
    };

    const getColor = (score) => {
        if (score <= 2) return '#10b981';
        if (score <= 4) return '#84cc16';
        if (score <= 6) return '#f59e0b';
        if (score <= 8) return '#f97316';
        return '#ef4444';
    };

    const getEmoji = (score) => {
        if (score === 0) return '😊';
        if (score <= 3) return '🙂';
        if (score <= 5) return '😐';
        if (score <= 7) return '😣';
        return '😫';
    };

    return (
        <>
            <div className={s.headerRow}>
                <div className={s.pageHeader}>
                    <h1 className={s.pageTitle}>🎯 Registro de Dolor</h1>
                    <p className={s.pageDesc}>Registra y monitorea tu dolor con la escala EVA (0-10)</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    + Registrar dolor
                </button>
            </div>

            {/* New Pain Record Form */}
            {showForm && (
                <div className={s.card}>
                    <h3 className={s.cardTitle}>Nuevo registro</h3>
                    <form onSubmit={handleSubmit}>
                        {/* EVA Slider */}
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                            <div className={s.evaValue} style={{ color: getColor(form.evaScore) }}>
                                {getEmoji(form.evaScore)} {form.evaScore}
                            </div>
                            <div className={s.evaLabel} style={{ color: getColor(form.evaScore) }}>
                                {form.evaScore === 0 ? 'Sin dolor' :
                                    form.evaScore <= 3 ? 'Dolor leve' :
                                        form.evaScore <= 6 ? 'Dolor moderado' :
                                            form.evaScore <= 8 ? 'Dolor severo' : 'Dolor extremo'}
                            </div>
                            <input type="range" min="0" max="10" value={form.evaScore}
                                onChange={(e) => setForm({ ...form, evaScore: parseInt(e.target.value) })}
                                className={s.evaSlider} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                                <span>0 — Sin dolor</span>
                                <span>10 — Peor imaginable</span>
                            </div>
                        </div>

                        <div className={s.formGrid}>
                            <div className={s.formGroup}>
                                <label className={s.formLabel}>Ubicación del dolor</label>
                                <input type="text" className={s.formInput} placeholder="Ej: Rodilla derecha, Lumbar..."
                                    value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                            </div>
                            <div className={s.formGroup}>
                                <label className={s.formLabel}>Contexto</label>
                                <input type="text" className={s.formInput} placeholder="Ej: En reposo, Al caminar..."
                                    value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} />
                            </div>
                        </div>

                        <div className={s.formGroup} style={{ marginTop: 'var(--space-4)' }}>
                            <label className={s.formLabel}>Notas adicionales</label>
                            <textarea className={s.formInput} rows={2} placeholder="Describe tu dolor..."
                                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                style={{ resize: 'vertical' }} />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar registro'}
                            </button>
                            <button type="button" className="btn" onClick={() => setShowForm(false)}
                                style={{ border: '1px solid var(--border-light)' }}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pain History */}
            <div className={s.card}>
                <h3 className={s.cardTitle}>📊 Historial de dolor</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Cargando...</p>
                ) : records.length === 0 ? (
                    <div className={s.emptyState}>
                        <div className={s.emptyIcon}>🎯</div>
                        <div className={s.emptyTitle}>Sin registros de dolor</div>
                        <p className={s.emptyDesc}>Registra tu dolor para que tu kinesiólogo pueda hacer seguimiento de tu evolución.</p>
                        <button className="btn btn-primary" onClick={() => setShowForm(true)}>Registrar dolor</button>
                    </div>
                ) : (
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>EVA</th>
                                <th>Ubicación</th>
                                <th>Contexto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r, i) => (
                                <tr key={i}>
                                    <td>{new Date(r.recordedAt || r.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}</td>
                                    <td>
                                        <span style={{
                                            fontFamily: 'var(--font-display)', fontWeight: 800,
                                            color: getColor(r.evaScore), fontSize: '1.125rem'
                                        }}>
                                            {r.evaScore}
                                        </span>
                                        <span style={{ marginLeft: '0.25rem', fontSize: '0.875rem' }}>{getEmoji(r.evaScore)}</span>
                                    </td>
                                    <td>{r.location}</td>
                                    <td style={{ color: 'var(--text-tertiary)' }}>{r.context || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
