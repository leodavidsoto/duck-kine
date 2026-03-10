'use client'

import styles from './copilot.module.css'

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function renderContent(text) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g)

  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^\w+\n/, '')
      return (
        <pre key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.25rem', overflowX: 'auto', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
          {code}
        </pre>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.1rem 0.2rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return (
      <span key={i}>
        {part.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((segment, j) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            return <strong key={j} style={{ fontWeight: 600 }}>{segment.slice(2, -2)}</strong>
          }
          if (segment.startsWith('*') && segment.endsWith('*')) {
            return <em key={j}>{segment.slice(1, -1)}</em>
          }
          return segment
        })}
      </span>
    )
  })
}

export function MessageBubble({ message, isHuman, isGrouped }) {
  const isSystem = message.message_type === 'system'
  const isHandoff = message.message_type === 'handoff'

  if (isSystem) {
    return (
      <div className={styles.systemMessage}>
        <div className={styles.systemBubble}>
          {message.content}
        </div>
      </div>
    )
  }

  if (isHandoff) {
    return (
      <div className={styles.systemMessage}>
        <div className={styles.systemBubble} style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)' }}>
          <span>{message.from_agent} transfirió a {message.to_agent}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.messageRow} ${isHuman ? styles.human : styles.agent}`}>
      <div className={`${styles.messageBubble} ${isHuman ? styles.human : styles.agent}`}>
        {!isHuman && !isGrouped && (
          <strong style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.2rem', opacity: 0.8 }}>
            {message.from_agent}
          </strong>
        )}
        {renderContent(message.content)}
        <span className={styles.messageTime}>{formatTime(message.created_at)}</span>
      </div>
    </div>
  )
}
