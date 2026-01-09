import React, { useState } from 'react'
import styles from './MessageCard.module.css'
import { useDispatch } from 'react-redux';
import { deleteMessage, markMessageRead } from '../../../redux/slices/contactSlice';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

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

   const handleDelete = (event) => {
      event.stopPropagation(); // Важно: чтобы карточка не открылась или закрылась
      dispatch(deleteMessage(msg.contact_id))
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
            <Popconfirm
               title='Удалить сообщение'
               onConfirm={handleDelete}
               okText='Да'
               cancelText='Нет'
               onCancel={(event) => event.stopPropagation()}
            >
               <DeleteOutlined 
               className={styles.deleteIcon} 
               onClick={(event) => event.stopPropagation()}
               />
            </Popconfirm>
         </div>
      </div>
   )
}

export default MessageCard
