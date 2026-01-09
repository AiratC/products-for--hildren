import React, { useState } from 'react'
import styles from './MessageCard.module.css'
import { useDispatch } from 'react-redux';
import { markMessageRead } from '../../../redux/slices/contactSlice';

const MessageCard = ({ msg }) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const dispatch = useDispatch();

   const dateDisplay = new Date(msg.created_at).toLocaleString('ru-Ru', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
   });

   const handleCardClick = () => {
      setIsExpanded(!isExpanded);

      if(msg.status === 'new') {
         dispatch(markMessageRead(msg.contact_id))
      }
   }


   return (
      <div
         className={`${styles.card} ${msg.status === 'new' ? `${styles.unread}` : `${styles.read}`}`} 
         onClick={handleCardClick}
      >
         <div className={styles.header}>
            <strong>{msg.name}</strong>
            <span className={styles.date}>{dateDisplay}</span>
         </div>

         <p className={`${styles.text} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            {msg.message}
         </p>

         <div className={styles.footer}>
            <span className={styles.phone}>{msg.phone}</span>
            <span className={msg.status === 'new' ? styles.badgeNew : styles.badgeRead}>
               {msg.status === 'new' ? 'Новое' : 'Прочитано'}
            </span>
         </div>
      </div>
   )
}

export default MessageCard
