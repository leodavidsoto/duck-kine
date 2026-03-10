'use client';

import { useState, useEffect } from 'react';
import s from '../admin.module.css';

export default function EntrenamientosAdminPage() {
    // 1. Estados
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);

    // MOCK DATA: Until real backend is connected
    const MOCK_CLASSES = [
        {
            id: 'class_1',
            title: 'Kine Funcional - HIIT',
            date: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
            capacity: 8,
            instructor: 'Carlos Muñoz',
            bookings: [
                { id: 'b1', patientName: 'Catalina Soto', status: 'CONFIRMED' },
                { id: 'b2', patientName: 'Matias Fernandez', status: 'BOOKED' },
                { id: 'b3', patientName: 'Diego Lopez', status: 'CANCELLED' },
            ]
        },
        {
            id: 'class_2',
            title: 'Reintegro Deportivo Avanzado',
            date: new Date(new Date().setHours(19, 30, 0, 0)).toISOString(),
            capacity: 6,
            instructor: 'Carlos Muñoz',
            bookings: [
                { id: 'b4', patientName: 'Camila Rojas', status: 'CONFIRMED' },
            ]
        }
    ];

    // 2. Carga de datos
    useEffect(() => {
        // Simulating fetch
        setTimeout(() => {
            setClasses(MOCK_CLASSES);
            setLoading(false);
        }, 800);
    }, []);

    // 3. Handlers
    const handleStatusChange = (bookingId, newStatus) => {
        if (!selectedClass) return;

        const updatedBookings = selectedClass.bookings.map(b =>
            b.id === bookingId ? { ...b, status: newStatus } : b
        );

        const updatedClass = { ...selectedClass, bookings: updatedBookings };
        setSelectedClass(updatedClass);

        setClasses(prev => prev.map(c =>
            c.id === selectedClass.id ? updatedClass : c
        ));

        // Todo: API Call to `PATCH /api/class-bookings/:id`
    };

    // 4. Render
    if (loading) return <div style={{ padding: '2rem' }}>Cargando entrenamientos...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

    const filtered = classes.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase())
    );

    // Detail View: List of attendees for a specific class
    if (selectedClass) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className={s.actionBtn} onClick={() => setSelectedClass(null)} style={{ margin: 0 }}>
                        ← Volver a Clases
                    </button>
                    <button className="btn btn-primary" onClick={() => alert('Esto enviará un email/WhatsApp de recordatorio a los asistentes')}>
                        🔔 Enviar Recordatorio
                    </button>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>Clase: {selectedClass.title}</h2>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                        📅 {new Date(selectedClass.date).toLocaleString('es-CL', { dateStyle: 'full', timeStyle: 'short' })} <br />
                        🧑‍🏫 Instructor: {selectedClass.instructor} <br />
                        👥 Cupos: {selectedClass.bookings.filter(b => b.status !== 'CANCELLED').length} / {selectedClass.capacity}
                    </p>

                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedClass.bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td style={{ fontWeight: 500 }}>{booking.patientName}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                                            background: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.2)'
                                                : booking.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.2)'
                                                    : booking.status === 'ATTENDED' ? 'rgba(59, 130, 246, 0.2)'
                                                        : 'rgba(245, 158, 11, 0.2)',
                                            color: booking.status === 'CONFIRMED' ? '#10b981'
                                                : booking.status === 'CANCELLED' ? '#ef4444'
                                                    : booking.status === 'ATTENDED' ? '#3b82f6'
                                                        : '#f59e0b'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                            style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                        >
                                            <option value="BOOKED">Reservado</option>
                                            <option value="CONFIRMED">Confirmado</option>
                                            <option value="ATTENDED">✅ Asistió</option>
                                            <option value="CANCELLED">❌ No Asistió / Canceló</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {selectedClass.bookings.length === 0 && (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>Nadie se ha inscrito aún.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // Master View: List of training classes
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className={s.headerRow}>
                <div className={s.pageHeader}>
                    <h1 className={s.pageTitle}>🏋️ Entrenamientos</h1>
                    <p className={s.pageDesc}>Gestiona las sesiones grupales y supervisa la asistencia de los pacientes.</p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Crear nueva clase de entrenamiento')}>
                    + Nueva Clase
                </button>
            </div>

            {/* Panel de Filtros */}
            <div className={s.filterPanel}>
                <input
                    type="text"
                    className={s.filterInput}
                    placeholder="Buscar por clase o instructor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid de Dashboard para las Clases Principales */}
            <div className={s.grid3}>
                <div className={s.statCard}>
                    <h3 className={s.statLabel}>Clases Hoy</h3>
                    <div className={s.statValue}>{classes.length}</div>
                </div>
                <div className={s.statCard}>
                    <h3 className={s.statLabel}>Asistencia Promedio</h3>
                    <div className={s.statValue}>85%</div>
                </div>
            </div>

            <div className={s.card}>
                <h3 className={s.cardTitle}>Próximas Sesiones</h3>
                <table className={s.table}>
                    <thead>
                        <tr>
                            <th>Fecha y Hora</th>
                            <th>Clase</th>
                            <th>Instructor</th>
                            <th>Cupos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => {
                            const occupied = c.bookings.filter(b => b.status !== 'CANCELLED').length;
                            return (
                                <tr key={c.id}>
                                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                        {new Date(c.date).toLocaleString('es-CL', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td>{c.title}</td>
                                    <td>{c.instructor}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>{occupied} / {c.capacity}</span>
                                            <div style={{ flex: 1, height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${(occupied / c.capacity) * 100}%`, background: occupied >= c.capacity ? '#ef4444' : 'var(--primary)' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className={s.actionBtn} onClick={() => setSelectedClass(c)}>
                                                Gestionar Asistencia
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '2rem' }}>No se encontraron clases.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
