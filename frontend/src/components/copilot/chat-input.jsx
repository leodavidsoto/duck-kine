'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useMissionControl } from '@/store/copilotStore'
import styles from './copilot.module.css'

export function ChatInput({ onSend, disabled, agents = [] }) {
  const { chatInput, setChatInput, isSendingMessage } = useMissionControl()
  const textareaRef = useRef(null)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionFilter, setMentionFilter] = useState('')
  const [mentionIndex, setMentionIndex] = useState(0)

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(mentionFilter.toLowerCase())
  )

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [])

  useEffect(() => {
    autoResize()
  }, [chatInput, autoResize])

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus()
    }
  }, [disabled])

  const handleKeyDown = (e) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMentionIndex(i => Math.min(i + 1, filteredAgents.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMentionIndex(i => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (filteredAgents[mentionIndex]) {
          insertMention(filteredAgents[mentionIndex].name)
        }
        return
      }
      if (e.key === 'Escape') {
        setShowMentions(false)
        return
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setChatInput(value)

    const cursorPos = e.target.selectionStart
    const textBeforeCursor = value.slice(0, cursorPos)
    const atMatch = textBeforeCursor.match(/@(\w*)$/)

    if (atMatch) {
      setMentionFilter(atMatch[1])
      setShowMentions(true)
      setMentionIndex(0)
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (agentName) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const textBeforeCursor = chatInput.slice(0, cursorPos)
    const textAfterCursor = chatInput.slice(cursorPos)
    const atIndex = textBeforeCursor.lastIndexOf('@')

    const newText = textBeforeCursor.slice(0, atIndex) + `@${agentName} ` + textAfterCursor
    setChatInput(newText)
    setShowMentions(false)

    setTimeout(() => {
      const newPos = atIndex + agentName.length + 2
      textarea.setSelectionRange(newPos, newPos)
      textarea.focus()
    }, 0)
  }

  const handleSend = () => {
    const trimmed = chatInput.trim()
    if (!trimmed || disabled || isSendingMessage) return
    onSend(trimmed)
    setChatInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className={styles.inputArea}>
      {showMentions && filteredAgents.length > 0 && (
        <div style={{ position: 'absolute', bottom: '100%', left: '1rem', right: '1rem', marginBottom: '0.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: '10rem', overflowY: 'auto', zIndex: 10 }}>
          {filteredAgents.map((agent, i) => (
            <button
              key={agent.name}
              style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: i === mentionIndex ? 'rgba(16, 185, 129, 0.2)' : 'transparent', color: i === mentionIndex ? 'white' : 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer' }}
              onMouseDown={(e) => {
                e.preventDefault()
                insertMention(agent.name)
              }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 'bold' }}>
                {agent.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 500 }}>@{agent.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'gray', marginLeft: 'auto' }}>{agent.role}</span>
            </button>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={chatInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Selecciona una conversación...' : 'Mensaje... (@ para mencionar)'}
        disabled={disabled || isSendingMessage}
        rows={1}
        className={styles.input}
        style={{ resize: 'none', overflowY: 'hidden', maxHeight: '120px' }}
      />

      <button
        onClick={handleSend}
        disabled={!chatInput.trim() || disabled || isSendingMessage}
        className={styles.sendBtn}
        style={{ opacity: (!chatInput.trim() || disabled || isSendingMessage) ? 0.4 : 1, cursor: (!chatInput.trim() || disabled || isSendingMessage) ? 'not-allowed' : 'pointer' }}
        title="Enviar mensaje"
      >
        {isSendingMessage ? '...' : 'Enviar'}
      </button>
    </div>
  )
}
