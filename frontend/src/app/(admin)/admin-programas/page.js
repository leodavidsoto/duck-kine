'use client';

import { useEffect, useState } from 'react';
import s from '../admin.module.css';
import { adminAPI } from '@/lib/api';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'];
const TYPES = ['REHABILITATION', 'SPORTS_PERFORMANCE', 'PREVENTION', 'POST_SURGICAL', 'CHRONIC_PAIN', 'RETURN_TO_SPORT'];
const levelLabel = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado', ELITE: 'Élite' };
const typeLabel = {
    REHABILITATION: 'Rehabilitación', SPORTS_PERFORMANCE: 'Rendimiento',
    PREVENTION: 'Prevención', POST_SURGICAL: 'Post-quirúrgico',
    CHRONIC_PAIN: 'Dolor crónico', RETURN_TO_SPORT: 'Retorno deportivo',
};

const emptyForm = { name: '', description: '', sport: '', type: 'SPORTS_PERFORMANCE', level: 'BEGINNER', durationWeeks: 8, sessionsPerWeek: 3, price: 0 };

export default function AdminProgramasPage() {
    const [programs, setPrograms] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('programs'); // programs | enrollments

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [progs, enrs] = await Promise.allSettled([
                adminAPI.getPrograms(),
                adminAPI.getProgramEnrollments(),
            ]);
            if (progs.status === 'fulfilled') setPrograms(progs.value.programs || []);
            if (enrs.status === 'fulfilled') setEnrollments(enrs.value.enrollments || []);
        } catch { }
        finally { setLoading(false); }
    };

    const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(''); };
    const openEdit = (p) => {
        setForm({
            name: p.name, description: p.description || '', sport: p.sport,
            type: p.type, level: p.level, durationWeeks: p.durationWeeks,
            sessionsPerWeek: p.sessionsPerWeek, price: Number(p.price),
        });
        setEditId(p.id);
        setShowForm(true);
        setError('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name || !form.sport) { setError('Nombre y deporte son obligatorios'); return; }
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, durationWeeks: Number(form.durationWeeks), sessionsPerWeek: Number(form.sessionsPerWeek), price: Number(form.price) };
            if (editId) await adminAPI.updateProgram(editId, payload);
            else await adminAPI.createProgram(payload);
            setShowForm(false);
            loadData();
        } catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Desactivar este programa?')) return;
        try { await adminAPI.deleteProgram(id); loadData(); }
        catch (err) { alert(err.message); }
    };

    const handleReactivate = async (id) => {
        try { await adminAPI.updateProgram(id, { isActive: true }); loadData(); }
        catch (err) { alert(err.message); }
    };

    return (
        <>
            <div className={s.pageHeader}>
                <h1 className={s.pageTitle}>🏃 Programas Deportivos</h1>
                <p className={s.pageDesc}>Crea y gestiona programas de rehabilitación y rendimiento</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button className={`${s.actionBtn} ${tab === 'programs' ? s.actionBtnPrimary : ''}`}
                    onClick={() => setTab('programs')} style={{ padding: '8px 16px' }}>
                    📋 Programas ({programs.length})
                </button>
                <button className={`${s.actionBtn} ${tab === 'enrollments' ? s.actionBtnPrimary : ''}`}
                    onClick={() => setTab('enrollments')} style={{ padding: '8px 16px' }}>
                    👥 Inscripciones ({enrollments.length})
                </button>
                <div style={{ flex: 1 }} />
                <button className={`${s.actionBtn} ${s.actionBtnSuccess}`}
                    onClick={openCreate} style={{ padding: '8px 16px' }}>
                    ＋ Crear programa
                </button>
            </div>

            {/* MODAL FORM */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setShowForm(false)}>
                    <div className={s.card} onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto', margin: '16px' }}>
                        <h3 className={s.cardTitle}>{editId ? '✏️ Editar programa' : '＋ Nuevo programa'}</h3>
                        {error && <div style={{ color: '#ff6b6b', fontSize: '0.8125rem', marginBottom: '12px' }}>{error}</div>}
                        <form onSubmit={handleSave}>
                            <FormField label="Nombre *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ej: Retorno al Running" />
                            <FormField label="Deporte *" value={form.sport} onChange={(v) => setForm({ ...form, sport: v })} placeholder="Ej: Running, CrossFit, Fútbol" />
                            <FormField label="Descripción" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <SelectField label="Tipo" value={form.type} options={TYPES.map(t => ({ value: t, label: typeLabel[t] }))} onChange={(v) => setForm({ ...form, type: v })} />
                                <SelectField label="Nivel" value={form.level} options={LEVELS.map(l => ({ value: l, label: levelLabel[l] }))} onChange={(v) => setForm({ ...form, level: v })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <FormField label="Duración (semanas)" type="number" value={form.durationWeeks} onChange={(v) => setForm({ ...form, durationWeeks: v })} />
                                <FormField label="Sesiones/semana" type="number" value={form.sessionsPerWeek} onChange={(v) => setForm({ ...form, sessionsPerWeek: v })} />
                                <FormField label="Precio ($)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowForm(false)} className={s.actionBtn} style={{ padding: '8px 20px' }}>Cancelar</button>
                                <button type="submit" className={`${s.actionBtn} ${s.actionBtnPrimary}`} style={{ padding: '8px 20px' }} disabled={saving}>
                                    {saving ? 'Guardando...' : (editId ? 'Guardar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PROGRAMS TABLE */}
            {tab === 'programs' && (
                <div className={s.card}>
                    {loading ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando...</p> : programs.length === 0 ? (
                        <div className={s.emptyState}>
                            <div className={s.emptyIcon}>🏃</div>
                            <div className={s.emptyTitle}>Sin programas</div>
                            <p className={s.emptyDesc}>Crea tu primer programa deportivo</p>
                        </div>
                    ) : (
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>Programa</th>
                                    <th>Deporte</th>
                                    <th>Nivel</th>
                                    <th>Duración</th>
                                    <th>Inscritos</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                                {typeLabel[p.type] || p.type}
                                            </div>
                                        </td>
                                        <td>{p.sport}</td>
                                        <td><span className="badge" style={{ fontSize: '0.7rem' }}>{levelLabel[p.level]}</span></td>
                                        <td>{p.durationWeeks}sem · {p.sessionsPerWeek}x</td>
                                        <td style={{ fontWeight: 700 }}>{p._count?.enrollments || 0}</td>
                                        <td>
                                            <span className={`badge badge-${p.isActive ? 'success' : 'error'}`}>
                                                {p.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={s.actionGroup}>
                                                <button className={`${s.actionBtn} ${s.actionBtnPrimary}`} onClick={() => openEdit(p)}>✏️</button>
                                                {p.isActive ? (
                                                    <button className={`${s.actionBtn} ${s.actionBtnError}`} onClick={() => handleDelete(p.id)}>🗑️</button>
                                                ) : (
                                                    <button className={`${s.actionBtn} ${s.actionBtnSuccess}`} onClick={() => handleReactivate(p.id)}>♻️</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ENROLLMENTS TABLE */}
            {tab === 'enrollments' && (
                <div className={s.card}>
                    {loading ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando...</p> : enrollments.length === 0 ? (
                        <div className={s.emptyState}>
                            <div className={s.emptyIcon}>👥</div>
                            <div className={s.emptyTitle}>Sin inscripciones</div>
                            <p className={s.emptyDesc}>Las inscripciones aparecerán aquí</p>
                        </div>
                    ) : (
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Programa</th>
                                    <th>Semana</th>
                                    <th>Progreso</th>
                                    <th>Estado</th>
                                    <th>Inicio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((en) => (
                                    <tr key={en.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>
                                                {en.patient?.user?.firstName} {en.patient?.user?.lastName}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                                {en.patient?.user?.email}
                                            </div>
                                        </td>
                                        <td>{en.program?.name}</td>
                                        <td style={{ fontWeight: 700 }}>Sem {en.currentWeek}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                                    <div style={{ width: `${en.completionPercentage || 0}%`, height: '100%', background: '#2ECC9A', borderRadius: '3px' }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{Math.round(en.completionPercentage || 0)}%</span>
                                            </div>
                                        </td>
                                        <td><span className={`badge badge-${en.status === 'ACTIVE' ? 'success' : 'warning'}`}>{en.status}</span></td>
                                        <td style={{ fontSize: '0.8125rem' }}>{new Date(en.startDate).toLocaleDateString('es-CL')}</td>
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

function FormField({ label, value, onChange, type = 'text', placeholder, textarea }) {
    const inputStyle = {
        width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff',
        fontSize: '0.875rem', outline: 'none', marginTop: '4px',
    };
    return (
        <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
            {textarea ? (
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            ) : (
                <input type={type} style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            )}
        </div>
    );
}

function SelectField({ label, value, options, onChange }) {
    return (
        <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
            <select style={{
                width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff',
                fontSize: '0.875rem', outline: 'none', marginTop: '4px',
            }} value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}
