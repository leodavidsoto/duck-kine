'use client'

import { useRef, useEffect } from 'react'
import { useMissionControl } from '@/store/copilotStore'
import { MessageBubble } from './message-bubble'
import styles from './copilot.module.css'

function formatDateGroup(timestamp) {
  const date = new Date(timestamp * 1000)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Hoy'
  if (date.toDateString() === yesterday.toDateString()) return 'Ayer'
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function groupMessagesByDate(messages) {
  const groups = []
  let currentDate = ''

  for (const msg of messages) {
    const dateStr = formatDateGroup(msg.created_at)
    if (dateStr !== currentDate) {
      currentDate = dateStr
      groups.push({ date: dateStr, messages: [] })
    }
    groups[groups.length - 1].messages.push(msg)
  }

  return groups
}

function isGroupedWithPrevious(messages, index) {
  if (index === 0) return false
  const prev = messages[index - 1]
  const curr = messages[index]
  return (
    prev.from_agent === curr.from_agent &&
    curr.created_at - prev.created_at < 120 &&
    prev.message_type !== 'system' &&
    curr.message_type !== 'system'
  )
}

export function MessageList() {
  const { chatMessages, activeConversation, isSendingMessage, updatePendingMessage, removePendingMessage, addChatMessage } = useMissionControl()
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [activeConversation])

  const handleRetry = async (msg) => {
    updatePendingMessage(msg.id, { pendingStatus: 'sending' })

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: msg.from_agent,
          to: msg.to_agent,
          content: msg.content,
          conversation_id: msg.conversation_id,
          message_type: msg.message_type,
          forward: true,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.message) {
          removePendingMessage(msg.id)
          addChatMessage(data.message)
        }
      } else {
        updatePendingMessage(msg.id, { pendingStatus: 'failed' })
      }
    } catch {
      updatePendingMessage(msg.id, { pendingStatus: 'failed' })
    }
  }

  if (!activeConversation) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'gray' }}>
        <div>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
          <p style={{ fontSize: '0.9rem' }}>Selecciona una conversación</p>
        </div>
      </div>
    )
  }

  const conversationMessages = chatMessages.filter(
    m => m.conversation_id === activeConversation
  )

  if (conversationMessages.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'gray' }}>
        <div>
          <p style={{ fontSize: '0.9rem' }}>Sin mensajes</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Escribe abajo para iniciar</p>
        </div>
      </div>
    )
  }

  const groups = groupMessagesByDate(conversationMessages)

  return (
    <div ref={containerRef} className={styles.messagesArea}>
      {groups.map((group) => (
        <div key={group.date}>
          <div className={styles.dateSeparator}>
            <div className={styles.dateLine} />
            <span className={styles.dateLabel}>{group.date}</span>
            <div className={styles.dateLine} />
          </div>

          {group.messages.map((msg, idx) => (
            <div key={`${msg.id}-${msg.created_at}-${idx}`} style={{ opacity: msg.pendingStatus === 'sending' ? 0.6 : 1 }}>
              {msg.pendingStatus === 'failed' && (
                <div style={{ border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', marginBottom: '0.25rem' }}>
                  <MessageBubble
                    message={msg}
                    isHuman={msg.from_agent === 'human'}
                    isGrouped={isGroupedWithPrevious(group.messages, idx)}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', padding: '0 0.5rem 0.5rem', fontSize: '0.65rem' }}>
                    <span style={{ color: '#ef4444' }}>Error al conectar</span>
                    <button onClick={() => handleRetry(msg)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}>Reintentar</button>
                    <button onClick={() => removePendingMessage(msg.id)} style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer' }}>Quitar</button>
                  </div>
                </div>
              )}

              {msg.pendingStatus !== 'failed' && (
                <MessageBubble
                  message={msg}
                  isHuman={msg.from_agent === 'human'}
                  isGrouped={isGroupedWithPrevious(group.messages, idx)}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {isSendingMessage && (
        <div className={`${styles.messageRow} ${styles.agent}`}>
          <div className={`${styles.messageBubble} ${styles.agent}`} style={{ fontStyle: 'italic', padding: '0.4rem 0.8rem', opacity: 0.7 }}>
            Escribiendo...
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
