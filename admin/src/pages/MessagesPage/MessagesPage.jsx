import { Empty, Spin } from 'antd'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getAllMessages } from '../../redux/slices/contactSlice';
import MessageCard from './MessageCard/MessageCard';
import styles from './MessageCard/MessageCard.module.css'

const MessagesPage = () => {
   const { messages, loading } = useSelector(state => state.contact);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(getAllMessages())
   }, [dispatch])


   if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin style={{ margin: '20px' }} /></div>
   }

   return (
      <div className={styles.containerMessagesCard}>
         { messages && messages.length > 0 ? (
            messages.map((msg) => (
               <MessageCard key={msg.contact_id} msg={msg}/>
            ))
         ) : (
            <Empty description='Сообщений пока нет' style={{ marginTop: '50px' }} />
         )
         }
      </div>
   )
}

export default MessagesPage
