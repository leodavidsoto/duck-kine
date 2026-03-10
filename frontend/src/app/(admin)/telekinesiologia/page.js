'use client'

import { useState, useEffect, useRef } from 'react'
import s from '../admin.module.css'
import { useMissionControl } from '@/store/copilotStore'

export default function TelekinesiologiaPage() {
    const [activeSession, setActiveSession] = useState(null)
    const [patientData, setPatientData] = useState(null)
    const [micEnabled, setMicEnabled] = useState(true)
    const [camEnabled, setCamEnabled] = useState(true)
    const [sessionNotes, setSessionNotes] = useState('')
    const { setChatPanelOpen, setActiveConversation, setChatInput } = useMissionControl()

    // WebRTC logic
    const [peerId, setPeerId] = useState('')
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('')
    const peerInstance = useRef(null)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const [callStatus, setCallStatus] = useState('Esperando paciente...')

    useEffect(() => {
        // Only run on client
        import('peerjs').then(({ default: Peer }) => {
            const peer = new Peer()

            peer.on('open', (id) => {
                setPeerId(id)
            })

            peer.on('call', (call) => {
                navigator.mediaDevices.getUserMedia({ video: camEnabled, audio: micEnabled })
                    .then((mediaStream) => {
                        if (localVideoRef.current) localVideoRef.current.srcObject = mediaStream
                        call.answer(mediaStream)
                        setCallStatus('En llamada')
                        call.on('stream', (remoteStream) => {
                            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                        })
                    })
                    .catch((err) => {
                        console.error('Failed to get local stream', err)
                        setCallStatus('Error con cámara/micrófono')
                    })
            })

            peerInstance.current = peer
            return () => peer.destroy()
        })
    }, [])

    useEffect(() => {
        // Toggle stream tracks if they exist
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject;
            stream.getAudioTracks().forEach(track => track.enabled = micEnabled);
            stream.getVideoTracks().forEach(track => track.enabled = camEnabled);
        }
    }, [micEnabled, camEnabled]);

    const handleCall = () => {
        if (!remotePeerIdValue) {
            setCallStatus('Ingresa un ID de paciente válido');
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: camEnabled, audio: micEnabled })
            .then((mediaStream) => {
                if (localVideoRef.current) localVideoRef.current.srcObject = mediaStream
                setCallStatus('Llamando...')

                const call = peerInstance.current.call(remotePeerIdValue, mediaStream)

                call.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                    setCallStatus('En llamada')
                })

                call.on('close', () => {
                    setCallStatus('Llamada finalizada')
                })
            })
            .catch((err) => {
                console.error('Failed to get local stream', err)
                setCallStatus('Error con cámara/micrófono')
            })
    }

    // Demo states
    const upcomingSessions = [
        { id: '1', patientName: 'Catalina Soto', time: '10:00 AM', reason: 'Control Post-Operatorio Rodilla' },
        { id: '2', patientName: 'Matias Fernandez', time: '11:30 AM', reason: 'Revisión Ergonomía Espalda' },
    ]

    const handleStartSession = (session) => {
        setActiveSession(session)
        // Simulate fetching patient data
        setPatientData({
            name: session.patientName,
            rut: '12.345.678-9',
            age: 28,
            history: 'Post-op LCA hace 3 semanas. Evolución favorable. Requiere revisión de rango de movimiento articular.'
        })
    }

    const endSession = () => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setActiveSession(null)
        setPatientData(null)
        setSessionNotes('')
        setCallStatus('Esperando paciente...')
    }

    if (activeSession) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)' }}>
                            🔴 Sesión en curso: {activeSession.patientName}
                        </h2>
                        <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{activeSession.reason}</span>
                    </div>
                    <button
                        onClick={endSession}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Terminar Consulta
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: 0 }}>
                    {/* Left: Video Area */}
                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ flex: 1, background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {callStatus !== 'En llamada' && (
                                <div style={{ position: 'absolute', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '4rem' }}>👤</div>
                                    <span>{callStatus}</span>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <input
                                            type="text"
                                            value={remotePeerIdValue}
                                            onChange={e => setRemotePeerIdValue(e.target.value)}
                                            placeholder="Patient Peer ID"
                                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem', borderRadius: '4px' }}
                                        />
                                        <button
                                            onClick={handleCall}
                                            style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Llamar
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>Tu ID Receptora: {peerId}</div>
                                </div>
                            )}

                            {/* Self View (Picture in Picture) */}
                            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '200px', height: '150px', background: '#222', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                />
                                {!camEnabled && (
                                    <span style={{ position: 'absolute', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Cámara Desactivada</span>
                                )}
                            </div>

                            {/* Call Controls */}
                            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
                                <button
                                    onClick={() => setMicEnabled(!micEnabled)}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: micEnabled ? 'rgba(255,255,255,0.2)' : '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                                    title={micEnabled ? 'Silenciar Micrófono' : 'Activar Micrófono'}
                                >
                                    {micEnabled ? '🎙️' : '🔇'}
                                </button>
                                <button
                                    onClick={() => setCamEnabled(!camEnabled)}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: camEnabled ? 'rgba(255,255,255,0.2)' : '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                                    title={camEnabled ? 'Apagar Cámara' : 'Encender Cámara'}
                                >
                                    {camEnabled ? '📷' : '🚫'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Clinical Data & Copilot Suggestion */}
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                        <div className={s.card}>
                            <h3 className={s.cardTitle}>Ficha Rápida</h3>
                            {patientData && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <div><span style={{ color: 'var(--muted-foreground)' }}>Paciente:</span> {patientData.name}</div>
                                    <div><span style={{ color: 'var(--muted-foreground)' }}>RUT:</span> {patientData.rut}</div>
                                    <div><span style={{ color: 'var(--muted-foreground)' }}>Edad:</span> {patientData.age} años</div>
                                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', lineHeight: 1.5 }}>
                                        <span style={{ color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>Historial Reciente:</span>
                                        {patientData.history}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={s.card} style={{ flex: 1 }}>
                            <h3 className={s.cardTitle}>Notas de Evolución</h3>
                            <textarea
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                                placeholder="Escribe aquí las observaciones de la sesión..."
                                style={{ width: '100%', height: 'calc(100% - 2rem)', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', color: 'var(--foreground)', resize: 'none', outline: 'none', fontFamily: 'inherit' }}
                            />
                        </div>

                        <button
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)' }}
                            onClick={() => {
                                setChatPanelOpen(true)
                                setActiveConversation('agent_aegis')
                                setChatInput(`Analiza la siguiente sesión de telekinesiología para el paciente ${patientData.name} (RUT: ${patientData.rut}). Notas tomadas por el profesional durante la llamada: "${sessionNotes || 'Sin notas adicionales'}". Genera un resumen clínico y próximos pasos.`)
                            }}
                        >
                            ✨ Generar Resumen con IA
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className={s.headerRow}>
                <div className={s.pageHeader} style={{ marginBottom: 0 }}>
                    <h1 className={s.pageTitle}>📹 Telekinesiología</h1>
                    <p className={s.pageDesc}>Gestiona tus consultas a distancia mediante videollamada</p>
                </div>
            </div>

            <div className={s.grid2}>
                <div className={s.card}>
                    <h3 className={s.cardTitle}>Próximas Sesiones Hoy</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {upcomingSessions.map(session => (
                            <div key={session.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-1)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{session.patientName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{session.time}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>{session.reason}</div>
                                </div>
                                <button
                                    onClick={() => handleStartSession(session)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    Iniciar Sala
                                </button>
                            </div>
                        ))}
                        {upcomingSessions.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                                No hay más sesiones programadas para hoy.
                            </div>
                        )}
                    </div>
                </div>

                <div className={s.card}>
                    <h3 className={s.cardTitle}>Requisitos del Sistema</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                            <span style={{ fontSize: '1.2rem' }}>✅</span> Navegador moderno (Chrome, Firefox, Safari)
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                            <span style={{ fontSize: '1.2rem' }}>✅</span> Permisos de cámara y micrófono habilitados
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                            <span style={{ fontSize: '1.2rem' }}>✅</span> Conexión estable a internet (Mín: 5 Mbps)
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                            <span style={{ fontSize: '1.2rem' }}>📹</span> Resolucion recomendada: 720p o superior
                        </li>
                    </ul>

                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: '2rem' }}
                        onClick={() => alert('Prueba de hardware iniciada...')}
                    >
                        Probar Equipo
                    </button>
                </div>
            </div>
        </div>
    )
}
