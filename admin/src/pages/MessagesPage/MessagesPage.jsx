import { Empty, Pagination, Spin } from 'antd'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getAllMessages } from '../../redux/slices/contactSlice';
import MessageCard from './MessageCard/MessageCard';
import styles from './MessageCard/MessageCard.module.css'

const MessagesPage = () => {
   const { messages, loading, pagination } = useSelector(state => state.contact);
   const dispatch = useDispatch();

   useEffect(() => {
      // Загружаем первую страницу
      dispatch(getAllMessages({ page: 1, limit: 10 }))
   }, [dispatch]);

   const handlePageChange = (page) => {
      dispatch(getAllMessages({ page, limit: 10 }));
      // Прокрутка вверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' })
   }


   if (loading && messages.length === 0) {
      return <div style={{ textAlign: 'center' }}><Spin style={{ margin: '20px' }} /></div>
   }

   return (
      <>
         <div className={styles.containerMessagesCard}>
            {messages && messages.length > 0 ? (
               messages?.map((msg) => (
                  <MessageCard key={msg.contact_id} msg={msg} />
               ))
            ) : (
               <Empty description='Сообщений пока нет' style={{ marginTop: '50px' }} />
            )
            }
         </div>

         {/* Пагинация */}
         <div style={{ marginTop: '30px', textAlign: 'center', paddingBottom: '40px' }}>
            <Pagination
               current={pagination.currentPage}
               total={pagination.total}
               pageSize={10}
               onChange={handlePageChange}
               showSizeChanger={false}
               hideOnSinglePage={true}
            />
         </div>
      </>
   )
}

export default MessagesPage
