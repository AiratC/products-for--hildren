import React from 'react'
import styles from './MessageCard.module.css'

const MessageCard = ({ msg }) => {
   const dateDisplay = new Date(msg.created_at).toLocaleString('ru-Ru', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
   });


   return (
      <div
         className={`${styles.card} ${msg.status === 'new' ? `${styles.unread}` : ''}`} onClick={() => console.log(`click card ${msg.contact_id}`)}
      >
         <div className={styles.header}>
            <strong>{msg.name}</strong>
            <span className={styles.date}>{dateDisplay}</span>
         </div>
         <p className={styles.text}>
            {msg.message ? (msg.message.length > 50 ? `${msg.message?.substring(0, 50)}...` : msg.message) : 'Нет текста сообщения'}
         </p>
         <div className={styles.footer}>
            <span>{msg.phone}</span>
            {msg.status === 'new' && <span className={styles.badge}>Новое</span>}
         </div>
      </div>
   )
}

export default MessageCard
