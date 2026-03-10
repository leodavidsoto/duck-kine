'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { useMissionControl } from '@/store/copilotStore'
import { useSmartPoll } from '@/lib/use-smart-poll'
import { createClientLogger } from '@/lib/client-logger'
import { ConversationList } from './conversation-list'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import styles from './copilot.module.css'

const log = createClientLogger('ChatPanel')

export function ChatPanel() {
  const {
    chatPanelOpen,
    setChatPanelOpen,
    activeConversation,
    setActiveConversation,
    setChatMessages,
    addChatMessage,
    replacePendingMessage,
    updatePendingMessage,
    setIsSendingMessage,
    agents,
    setAgents,
  } = useMissionControl()

  const pendingIdRef = useRef(-1)
  const [showConversations, setShowConversations] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile && activeConversation) {
      setShowConversations(false)
    }
  }, [isMobile, activeConversation])

  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await fetch('/api/agents')
        if (!res.ok) return
        const data = await res.json()
        if (data.agents) setAgents(data.agents)
      } catch (err) {
        log.error('Failed to load agents:', err)
      }
    }
    if (chatPanelOpen) loadAgents()
  }, [chatPanelOpen, setAgents])

  const loadMessages = useCallback(async () => {
    if (!activeConversation) return
    try {
      const res = await fetch(`/api/chat/messages?conversation_id=${encodeURIComponent(activeConversation)}&limit=100`)
      if (!res.ok) return
      const data = await res.json()
      if (data.messages) setChatMessages(data.messages)
    } catch (err) {
      log.error('Failed to load messages:', err)
    }
  }, [activeConversation, setChatMessages])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  useSmartPoll(loadMessages, 15000, {
    enabled: !!activeConversation && chatPanelOpen,
    pauseWhenSseConnected: true,
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && chatPanelOpen) {
        setChatPanelOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [chatPanelOpen, setChatPanelOpen])

  const handleSend = async (content) => {
    if (!activeConversation) return

    const mentionMatch = content.match(/^@(\w+)\s/)
    let to = mentionMatch ? mentionMatch[1] : null
    const cleanContent = mentionMatch ? content.slice(mentionMatch[0].length) : content

    if (!to && activeConversation.startsWith('agent_')) {
      to = activeConversation.replace('agent_', '')
    }

    pendingIdRef.current -= 1
    const tempId = pendingIdRef.current
    const optimisticMessage = {
      id: tempId,
      conversation_id: activeConversation,
      from_agent: 'human',
      to_agent: to,
      content: cleanContent,
      message_type: 'text',
      created_at: Math.floor(Date.now() / 1000),
      pendingStatus: 'sending',
    }

    addChatMessage(optimisticMessage)

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'human',
          to,
          content: cleanContent,
          conversation_id: activeConversation,
          message_type: 'text',
          forward: true,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.message) {
          replacePendingMessage(tempId, data.message)
        }
      } else {
        updatePendingMessage(tempId, { pendingStatus: 'failed' })
      }
    } catch (err) {
      log.error('Failed to send message:', err)
      updatePendingMessage(tempId, { pendingStatus: 'failed' })
    }
  }

  const handleNewConversation = (agentName) => {
    const convId = `agent_${agentName}`
    setActiveConversation(convId)
    if (isMobile) setShowConversations(false)
  }

  const handleBackToList = () => {
    setShowConversations(true)
    if (isMobile) setActiveConversation(null)
  }

  // The actual Floating Widget Button is rendered if closed
  if (!chatPanelOpen) {
    return (
      <div className={styles.copilotContainer}>
        <button
          className={styles.floatingBtn}
          onClick={() => setChatPanelOpen(true)}
          title="Abrir Copiloto IA"
        >
          🤖
        </button>
      </div>
    )
  }

  return (
    <div className={styles.copilotContainer}>
      {chatPanelOpen && (
        <div ref={panelRef} className={styles.chatWindow}>

          <div className={styles.header}>
            <div className={styles.agentInfo}>
              <span className={styles.avatar}>🤖</span>
              <div>
                <div className={styles.agentName}>DuckBot Copilot</div>
                <div className={styles.agentStatus}>Online ({agents.filter(a => a.status === 'busy' || a.status === 'idle').length} vivos)</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowConversations(!showConversations)} className={styles.closeBtn} title="Conversaciones">
                ≡
              </button>
              <button onClick={() => setChatPanelOpen(false)} className={styles.closeBtn} title="Cerrar">
                ×
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {showConversations && (
              <div style={{ width: '150px', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto' }}>
                <ConversationList onNewConversation={handleNewConversation} />
              </div>
            )}

            {(!isMobile || !showConversations) && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {activeConversation && (
                  <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'gray' }}>
                    Chatting with: {activeConversation.replace('agent_', '')}
                  </div>
                )}
                <MessageList />
                <ChatInput
                  onSend={handleSend}
                  disabled={!activeConversation}
                  agents={agents.map(a => ({ name: a.name, role: a.role }))}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <button
        className={`${styles.floatingBtn} ${chatPanelOpen ? styles.hidden : ''}`}
        onClick={() => setChatPanelOpen(true)}
        title="Abrir Copiloto IA"
      >
        🤖
      </button>
    </div>
  )
}
