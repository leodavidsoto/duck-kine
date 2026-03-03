'use client';

import { useEffect, useState } from 'react';
import { trainingClassesAPI } from '@/lib/api';
import s from './page.module.css';

export default function ClasesPage() {
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'myClasses'
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // id of class being acted upon

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'upcoming') {
                const data = await trainingClassesAPI.getUpcoming();
                setUpcomingClasses(data);
                const myData = await trainingClassesAPI.getMyClasses();
                setMyBookings(myData);
            } else {
                const data = await trainingClassesAPI.getMyClasses();
                setMyBookings(data);
            }
        } catch (err) {
            setError('Error al cargar la información de las clases');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (classId) => {
        setActionLoading(classId);
        try {
            await trainingClassesAPI.bookClass(classId);
            await loadData();
        } catch (err) {
            alert(err.message || 'Error al reservar la clase');
        } finally {
            setActionLoading(null);
        }
    };

    const handleConfirm = async (classId) => {
        setActionLoading(classId);
        try {
            await trainingClassesAPI.confirmAttendance(classId);
            await loadData();
        } catch (err) {
            alert(err.message || 'Error al confirmar la asistencia');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return {
            month: d.toLocaleString('es-CL', { month: 'short' }).replace('.', ''),
            day: d.getDate().toString().padStart(2, '0'),
            time: d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getBookingStatus = (classId) => {
        const booking = myBookings.find(b => b.classId === classId);
        return booking ? booking.status : null;
    };

    const renderUpcomingClasses = () => {
        if (upcomingClasses.length === 0) {
            return (
                <div className={s.emptyState} style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📅</div>
                    <h3>No hay clases disponibles</h3>
                    <p style={{ color: 'var(--text-tertiary)' }}>Revisa más tarde cuando publiquemos los nuevos horarios y rutinas.</p>
                </div>
            );
        }

        return upcomingClasses.map((cls) => {
            const dateInfo = formatDate(cls.startTime);
            const bookedCount = cls._count?.bookings || 0;
            const isFull = bookedCount >= cls.capacity;
            const status = getBookingStatus(cls.id);
            const isBooked = ['BOOKED', 'CONFIRMED', 'ATTENDED'].includes(status);

            return (
                <div key={cls.id} className={s.card}>
                    <div className={s.cardHeader}>
                        <div>
                            <h3 className={s.classTitle}>{cls.title}</h3>
                            <div className={s.trainerInfo}>
                                <span>🧑‍🏫 {cls.trainer?.user?.firstName || 'Entrenador'}</span>
                            </div>
                        </div>
                        <div className={s.calendarDate}>
                            <span className={s.month}>{dateInfo.month}</span>
                            <span className={s.day}>{dateInfo.day}</span>
                            <span className={s.time}>{dateInfo.time}</span>
                        </div>
                    </div>

                    {cls.description && (
                        <div className={s.descriptionBox}>
                            <div className={s.descriptionLabel}>WOD / Rutina del Día</div>
                            <div className={s.description}>{cls.description}</div>
                        </div>
                    )}

                    <div className={s.metrics}>
                        <div className={s.capacity}>
                            <span>👥 {bookedCount}/{cls.capacity}</span>
                            <div className={s.capacityBar}>
                                <div
                                    className={s.capacityFill}
                                    style={{
                                        width: Math.min(100, (bookedCount / cls.capacity) * 100) + '%',
                                        background: isFull ? 'var(--danger)' : 'var(--primary)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {isBooked ? (
                        <div className={s.tagConfirmed}>
                            ✅ Ya estás anotado
                        </div>
                    ) : (
                        <button
                            className={[s.btnAction, s.btnBook].join(' ')}
                            disabled={isFull || actionLoading === cls.id}
                            onClick={() => handleBook(cls.id)}
                        >
                            {actionLoading === cls.id ? '...' : (isFull ? 'Clase Llena' : 'Reservar Cupo')}
                        </button>
                    )}
                </div>
            );
        });
    };

    const renderMyClasses = () => {
        if (myBookings.length === 0) {
            return (
                <div className={s.emptyState} style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>👟</div>
                    <h3>Aún no tienes reservas</h3>
                    <p style={{ color: 'var(--text-tertiary)' }}>Ve al calendario y anótate en tu próxima sesión de entrenamiento.</p>
                </div>
            );
        }

        return myBookings.map((booking) => {
            const cls = booking.trainingClass;
            const dateInfo = formatDate(cls.startTime);
            const isConfirmed = booking.status === 'CONFIRMED' || booking.status === 'ATTENDED';

            return (
                <div key={booking.id} className={s.card} style={{ borderColor: isConfirmed ? 'var(--success)' : 'var(--border-light)' }}>
                    <div className={s.cardHeader}>
                        <div>
                            <h3 className={s.classTitle}>{cls.title}</h3>
                            <div className={s.trainerInfo}>
                                <span>🧑‍🏫 {cls.trainer?.user?.firstName || 'Entrenador'}</span>
                            </div>
                        </div>
                        <div className={s.calendarDate}>
                            <span className={s.month}>{dateInfo.month}</span>
                            <span className={s.day}>{dateInfo.day}</span>
                            <span className={s.time}>{dateInfo.time}</span>
                        </div>
                    </div>

                    {cls.description && (
                        <div className={s.descriptionBox}>
                            <div className={s.descriptionLabel}>WOD / Rutina del Día</div>
                            <div className={s.description}>{cls.description}</div>
                        </div>
                    )}

                    {isConfirmed ? (
                        <div className={s.tagConfirmed}>
                            ✅ Asistencia Confirmada
                        </div>
                    ) : (
                        <button
                            className={[s.btnAction, s.btnConfirm].join(' ')}
                            disabled={actionLoading === cls.id}
                            onClick={() => handleConfirm(cls.id)}
                        >
                            {actionLoading === cls.id ? '...' : '¡Voy a la clase! (Confirmar)'}
                        </button>
                    )}
                </div>
            );
        });
    };

    return (
        <div className={s.container}>
            <div className={s.header}>
                <h1 className={s.title}>⚡ Centro de Entrenamiento</h1>
                <p className={s.desc}>Reserva tus clases, revisa el WOD del día y confirma tu asistencia.</p>
            </div>

            <div className={s.tabs}>
                <button
                    className={[s.tabBtn, activeTab === 'upcoming' ? s.tabBtnActive : ''].join(' ')}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Calendario de Clases
                </button>
                <button
                    className={[s.tabBtn, activeTab === 'myClasses' ? s.tabBtnActive : ''].join(' ')}
                    onClick={() => setActiveTab('myClasses')}
                >
                    Mis Reservas
                </button>
            </div>

            {error && (
                <div style={{ color: 'var(--danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-md)' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    Cargando clases...
                </div>
            ) : (
                <div className={s.grid}>
                    {activeTab === 'upcoming' ? renderUpcomingClasses() : renderMyClasses()}
                </div>
            )}
        </div>
    );
}
