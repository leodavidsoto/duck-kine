'use client'

import { useState, useCallback } from 'react'
import { useMissionControl } from '@/store/copilotStore'
import { useSmartPoll } from '@/lib/use-smart-poll'
import { createClientLogger } from '@/lib/client-logger'
import styles from './copilot.module.css'

const log = createClientLogger('ConversationList')

function timeAgo(timestamp) {
  const diff = Math.floor(Date.now() / 1000) - timestamp
  if (diff < 60) return 'now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export function ConversationList({ onNewConversation }) {
  const {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    agents,
    markConversationRead,
  } = useMissionControl()
  const [showNewChat, setShowNewChat] = useState(false)
  const [search, setSearch] = useState('')

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/conversations')
      if (!res.ok) return
      const data = await res.json()
      if (data.conversations) {
        setConversations(
          data.conversations.map((c) => ({
            id: c.conversation_id,
            participants: [],
            lastMessage: c.last_message
              ? {
                id: c.last_message.id,
                conversation_id: c.last_message.conversation_id,
                from_agent: c.last_message.from_agent,
                to_agent: c.last_message.to_agent,
                content: c.last_message.content,
                message_type: c.last_message.message_type,
                metadata: c.last_message.metadata,
                read_at: c.last_message.read_at,
                created_at: c.last_message.created_at,
              }
              : undefined,
            unreadCount: c.unread_count || 0,
            updatedAt: c.last_message_at || 0,
          }))
        )
      }
    } catch (err) {
      log.error('Failed to load conversations:', err)
    }
  }, [setConversations])

  useSmartPoll(loadConversations, 30000, { pauseWhenSseConnected: true })

  const handleSelect = (convId) => {
    setActiveConversation(convId)
    markConversationRead(convId)
  }

  const filteredConversations = conversations.filter((c) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      c.id.toLowerCase().includes(s) ||
      c.lastMessage?.from_agent.toLowerCase().includes(s) ||
      c.lastMessage?.content.toLowerCase().includes(s)
    )
  })

  return (
    <div className={styles.conversationList}>
      {/* Header */}
      <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '0.7rem', fontWeight: 600, color: 'gray', textTransform: 'uppercase' }}>Chats</h3>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}
            title="Nuevo chat"
          >
            +
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.25rem', padding: '0.4rem', color: 'white', fontSize: '0.8rem' }}
        />
      </div>

      {/* New chat picker */}
      {showNewChat && (
        <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', maxHeight: '150px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', color: 'gray', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Agentes</div>
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => {
                onNewConversation(agent.name)
                setShowNewChat(false)
              }}
              style={{ width: '100%', textAlign: 'left', padding: '0.4rem', background: 'transparent', border: 'none', color: 'white', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.status === 'busy' || agent.status === 'idle' ? '#10b981' : 'gray' }} />
              <span style={{ fontWeight: 500 }}>{agent.name}</span>
            </button>
          ))}
          {agents.length === 0 && (
            <div style={{ fontSize: '0.75rem', color: 'gray', padding: '0.5rem' }}>No hay agentes</div>
          )}
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredConversations.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'gray' }}>
            No hay chats
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const agentName = conv.id.replace('agent_', '')
            const isActive = activeConversation === conv.id

            return (
              <button
                key={conv.id}
                onClick={() => handleSelect(conv.id)}
                className={`${styles.conversationItem} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.conversationAvatar}>
                  {agentName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.conversationMeta}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.conversationName}>{agentName}</span>
                    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      {conv.unreadCount > 0 && (
                        <span style={{ background: '#10b981', color: 'white', fontSize: '0.6rem', padding: '0 0.3rem', borderRadius: '1rem' }}>
                          {conv.unreadCount}
                        </span>
                      )}
                      <span style={{ fontSize: '0.6rem', color: 'gray' }}>
                        {conv.updatedAt ? timeAgo(conv.updatedAt) : ''}
                      </span>
                    </div>
                  </div>
                  {conv.lastMessage && (
                    <div className={styles.conversationPreview}>
                      {conv.lastMessage.from_agent === 'human'
                        ? `Tú: ${conv.lastMessage.content}`
                        : conv.lastMessage.content}
                    </div>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
