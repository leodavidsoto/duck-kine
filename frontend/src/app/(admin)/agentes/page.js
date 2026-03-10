'use client';

import { useState, useEffect } from 'react';
import s from '../admin.module.css';

export default function AgentesIAPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    // MOCK DATA: Representing the OpenClaw / Anthropic agents
    const MOCK_AGENTS = [
        {
            id: 'duckbot_ig',
            name: 'DuckBot Instagram',
            description: 'Agente autónomo que responde DMs y comentarios en Instagram.',
            model: 'claude-3-5-haiku-20241022',
            status: 'ACTIVE',
            metrics: {
                messagesHandled: 1245,
                avgResponseTime: '12s',
                costThisMonth: '$3.40'
            },
            lastActive: 'Hace 2 min'
        },
        {
            id: 'duckbot_web',
            name: 'DuckBot Web Copilot',
            description: 'Copiloto clínico integrado en el dashboard de administración.',
            model: 'claude-3-5-sonnet-20240620',
            status: 'SLEEPING',
            metrics: {
                messagesHandled: 34,
                avgResponseTime: '4s',
                costThisMonth: '$0.85'
            },
            lastActive: 'Hace 3 horas'
        },
        {
            id: 'duckbot_wsp',
            name: 'DuckBot WhatsApp',
            description: 'Agente de recepción y agendamiento automático por WhatsApp.',
            model: 'claude-3-haiku-20240307',
            status: 'PAUSED',
            metrics: {
                messagesHandled: 0,
                avgResponseTime: '-',
                costThisMonth: '$0.00'
            },
            lastActive: 'Nunca'
        }
    ];

    useEffect(() => {
        setTimeout(() => {
            setAgents(MOCK_AGENTS);
            setLoading(false);
        }, 600);
    }, []);

    const toggleAgentStatus = (id) => {
        setAgents(prev => prev.map(a => {
            if (a.id === id) {
                const newStatus = a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
                return { ...a, status: newStatus };
            }
            return a;
        }));
    };

    if (loading) return <div style={{ padding: '2rem' }}>Conectando con OpenClaw Gateway...</div>;

    const activeCount = agents.filter(a => a.status === 'ACTIVE').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div className={s.headerRow}>
                <div className={s.pageHeader}>
                    <h1 className={s.pageTitle}>🤖 Agentes IA</h1>
                    <p className={s.pageDesc}>Gestiona tu flota de DuckBots y su integración con redes y clínica.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => alert('Abriendo logs del sistema')}>
                        Ver Logs Globales
                    </button>
                    <button className="btn btn-primary" onClick={() => alert('Iniciar proceso de creación de nuevo agente')}>
                        + Configurar Nuevo Agente
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className={s.grid3}>
                <div className={s.statCard} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
                    <h3 className={s.statLabel} style={{ color: '#10b981' }}>Agentes Activos</h3>
                    <div className={s.statValue}>{activeCount} / {agents.length}</div>
                </div>
                <div className={s.statCard}>
                    <h3 className={s.statLabel}>Mensajes Procesados (Mes)</h3>
                    <div className={s.statValue}>1,279</div>
                </div>
                <div className={s.statCard}>
                    <h3 className={s.statLabel}>Costo Anthropic (Estimado)</h3>
                    <div className={s.statValue}>$4.25 USD</div>
                </div>
            </div>

            {/* Agent Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {agents.map(agent => (
                    <div key={agent.id} className={s.card} style={{ position: 'relative', borderTop: `4px solid ${agent.status === 'ACTIVE' ? '#10b981' : agent.status === 'SLEEPING' ? '#3b82f6' : '#ef4444'}` }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                            <span style={{
                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                background: agent.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)'
                                    : agent.status === 'SLEEPING' ? 'rgba(59, 130, 246, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                color: agent.status === 'ACTIVE' ? '#10b981'
                                    : agent.status === 'SLEEPING' ? '#3b82f6'
                                        : '#ef4444'
                            }}>
                                {agent.status === 'ACTIVE' ? '🟢 ONLINE' : agent.status === 'SLEEPING' ? '💤 DURMIENDO' : '🔴 PAUSADO'}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem', paddingRight: '100px' }}>
                            {agent.name}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', minHeight: '40px' }}>
                            {agent.description}
                        </p>

                        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--muted-foreground)' }}>Modelo:</span>
                                <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{agent.model}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--muted-foreground)' }}>Interacciones:</span>
                                <span>{agent.metrics.messagesHandled}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--muted-foreground)' }}>Último ping:</span>
                                <span>{agent.lastActive}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1, background: agent.status === 'ACTIVE' ? '#ef4444' : '#10b981', color: 'white' }}
                                onClick={() => toggleAgentStatus(agent.id)}
                            >
                                {agent.status === 'ACTIVE' ? 'Pausar Agente' : 'Despertar Agente'}
                            </button>
                            <button className="btn btn-secondary" onClick={() => alert(`Abriendo configuración avanzada de ${agent.name}`)}>
                                ⚙️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={s.card} style={{ marginTop: '1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h3 className={s.cardTitle} style={{ color: '#3b82f6' }}>ℹ️ Integración OpenClaw Gateway</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                    Los agentes mostrados aquí están conectados a través del OpenClaw Gateway. El motor de orquestación maneja los Webhooks de Meta (Instagram/WhatsApp) y enruta los mensajes hacia los modelos optimizados de Anthropic (Haiku/Sonnet) dependiendo de la complejidad visual de los archivos adjuntos.
                </p>
            </div>
        </div>
    );
}
