import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './CheckoutPage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../../redux/slices/cartSlice';
import OrderSummary from '../../components/OrderSummary/OrderSummary';

const CheckoutPage = () => {
   const { cartItems } = useSelector((state) => state.cart);
   // Режимы 'tk' (Транспортная компания), 'post' (Почта), 'self' (Самовывоз)
   const [deliveryMethod, setDeliveryMethod] = useState('tk');
   const [formData, setFormData] = useState({
      fullName: '', phone: '', email: '',
      city: '', street: '', house: '', apartment: '', postIndex: '',
      transportCompany: 'СДЭК', comment: ''
   });
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(fetchCart());
   }, [dispatch]);

   const totalPrice = useMemo(() => {
      return cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)
   }, [cartItems]);

   const totalCount = useMemo(() => {
      return cartItems.reduce((count, item) => count + Number(item.quantity), 0)
   }, [cartItems])

   const handleChange = useCallback((e) => {
      setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
   }, []);

   const handleSubmit = useCallback((e) => {
      e.preventDefault();

      // Формируем объект строго по твоим таблицам SQL
      const payload = {
         delivery_method: deliveryMethod,
         payment_method: 'card',
         contact_info: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email
         },
         recipient_address: {
            city: formData.city,
            street: formData.street,
            house: formData.house,
            apartment: formData.apartment,
            // Индекс только для почты
            ...(deliveryMethod === 'post' && { postIndex: formData.postIndex })
         },
         choosing_transport_company: deliveryMethod === 'tk' ? formData.transportCompany : null,
         total_amount: totalPrice,
         comment_the_order: formData.comment,
         // Массив для Order_Items с фиксацией цены
         order_items: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price
         }))
      };

      console.log("Отправка в БД:", payload);
   },
      [
         cartItems, deliveryMethod, formData.apartment, formData.city,
         formData.comment, formData.email, formData.fullName, formData.house,
         formData.phone, formData.postIndex, formData.street, formData.transportCompany,
         totalPrice
      ]
   );

   return (
      <div className={styles.wrapper}>
         <div>
            <h1 className={styles.title}>Оформление заказа</h1>
            <div>
               {/* Левая секция */}
               <div className={styles.content}>
                  {/* Состав заказа */}
                  <div>
                     <h2>Состав заказа</h2>
                  </div>

                  <div>
                     <h2>Город получателя</h2>
                  </div>

                  {/* Способ получения */}
                  <div className={styles.card}>
                     <h2 className={styles.cardTitle}>Способ получения</h2>

                     <div className={styles.deliveryTabs}>

                     </div>

                     <div className={styles.dynamicArea}>
                        {deliveryMethod === 'tk' && (
                           'text'
                        )}

                        {deliveryMethod === 'post' && (
                           'text'
                        )}

                        {deliveryMethod === 'self' && (
                           'text'
                        )}
                     </div>
                  </div>

                  <div className={styles.card}>
                     <h2 className={styles.cardTitle}>Дополнительно</h2>
                     <textarea name="comment" placeholder="Напишите пожелания к заказу..." rows="3" onChange={handleChange}></textarea>
                  </div>
               </div>

               {/* Правая секция */}
               {/* Сайдбар с итогами */}
               <OrderSummary totalPrice={totalPrice} totalCount={totalCount}/>
            </div>
         </div>
      </div>
   )
}

export default CheckoutPage
