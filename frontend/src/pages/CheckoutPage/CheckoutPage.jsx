import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './CheckoutPage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../../redux/slices/cartSlice';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import { Link } from 'react-router';

const companies = [
   { id: 'sdek', name: 'СДЭК' },
   { id: 'lines', name: 'Деловые линии' },
   { id: 'pek', name: 'ПЭК' }
];

const CheckoutPage = () => {
   const { cartItems } = useSelector((state) => state.cart);
   const { user } = useSelector((state) => state.authUser);
   // Режимы 'tk' (Транспортная компания), 'post' (Почта), 'self' (Самовывоз)
   const [deliveryMethod, setDeliveryMethod] = useState('tk');
   const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'cash_courier', 'paypal', 'cash_on_delivery'
   const [formData, setFormData] = useState({
      fullName: '', phone: '', email: '',
      city: '', street: '', house: '', apartment: '', postIndex: '',
      transportCompany: 'СДЭК', comment: ''
   });
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(fetchCart());
   }, [dispatch]);

   // Всегда поднимаем страницу вверх
   useEffect(() => {
      window.scrollTo(0, 0)
   }, [])

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
         payment_method: paymentMethod,
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
      [cartItems, deliveryMethod, formData, totalPrice, paymentMethod]
   );

   return (
      <div className={`${styles.wrapper}`}>
         <div>
            <h1 className={styles.title}>Оформление заказа</h1>
            <div className={styles.sectionCheckoutContainer}>
               {/* Левая секция */}
               <div className={styles.content}>

                  {/* Состав заказа */}
                  <div className={styles.orderCompositionContainer}>
                     <h2>Состав заказа</h2>
                     {
                        cartItems?.map((item) => (
                           <div className={styles.orderCompositionCard} key={item.product_id}>
                              <img src={item.product_images[0]} alt={item.title} />
                              <div>
                                 <h4>{item.title}</h4>
                                 <span>{item.quantity} шт.</span>
                              </div>
                           </div>
                        ))
                     }
                  </div>

                  <div className={styles.recipientCityContainer}>
                     <h2>Город получателя</h2>
                     <div>
                        <div className={styles.cityContainer}>
                           <h6>Населенный пункт</h6>
                           {
                              user?.delivery_address ? (
                                 <span className={styles.city}>{user?.delivery_address}</span>
                              ) : (
                                 <Link to={`/personal-data`}>
                                    <span className={styles.indicate}>Указать</span>
                                 </Link>
                              )
                           }
                        </div>
                     </div>
                  </div>

                  {/* Способ получения */}
                  <div className={styles.methodObtainingContainer}>
                     <h2 className={styles.methodObtainingTitle}>Способ получения</h2>

                     <div className={styles.deliveryTabsContainer}>
                        <div
                           onClick={() => setDeliveryMethod('tk')}
                           className={`${styles.deliveryTabsCard} ${deliveryMethod === 'tk' ? styles.active : ''}`}>
                           <h6>Транспортной компанией</h6>
                           <p>СДЕК, Деловые линии, ПЭК</p>
                           <span>Цена зависит от выбора ТК</span>
                        </div>

                        <div
                           onClick={() => setDeliveryMethod('post')}
                           className={`${styles.deliveryTabsCard} ${deliveryMethod === 'post' ? styles.active : ''}`}>
                           <h6>Почтой</h6>
                           <p>В ближайшее отделение почты России</p>
                           <span>Бесплатно</span>
                        </div>

                        <div
                           onClick={() => setDeliveryMethod('self')}
                           className={`${styles.deliveryTabsCard} ${deliveryMethod === 'self' ? styles.active : ''}`}>
                           <h6>Самовывоз</h6>
                           <p>В пункте выдачи</p>
                           <span>Бесплатно</span>
                        </div>
                     </div>

                     <div className={styles.dynamicArea}>
                        {deliveryMethod === 'tk' && (
                           <form onSubmit={handleSubmit}>
                              <div className={styles.tkSelection}>
                                 <h3 className={styles.tkTitle}>Выбор транспортной компании</h3>
                                 <div className={styles.chipGroup}>
                                    {companies.map((co) => (
                                       <div
                                          key={co.id}
                                          className={`${styles.chip} ${formData.transportCompany === co.name ? styles.active : ''}`}
                                          onClick={() => setFormData(prevData => ({ ...prevData, transportCompany: co.name }))}
                                       >
                                          {co.name}
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              {/* Сетка всех полей ввода */}
                              <div>
                                 <h3 className={styles.recipientAddressTitle}>Адрес получателя</h3>
                                 <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                       <label>Город доставки</label>
                                       <input onChange={handleChange} value={formData.city} name='city' type="text" placeholder="Город" />
                                    </div>

                                    <div className={`${styles.inputGroup}`}>
                                       <label>Улица</label>
                                       <input onChange={handleChange} value={formData.street} name='street' type="text" placeholder="ул. Ленина" />
                                    </div>

                                    <div className={styles.inputGroup}>
                                       <label>Дом</label>
                                       <input onChange={handleChange} value={formData.house} name='house' type="text" placeholder="Номер дома" />
                                    </div>

                                    <div className={styles.inputGroup}>
                                       <label>Квартира / Офис</label>
                                       <input onChange={handleChange} value={formData.apartment} name='apartment' type="text" placeholder="Номер квартиры" />
                                    </div>

                                    <div className={styles.inputGroup}>
                                       <label>Телефон</label>
                                       <input onChange={handleChange} value={formData.phone} name='phone' type="tel" placeholder="Телефон*" />
                                    </div>

                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                       <label>ФИО</label>
                                       <input onChange={handleChange} value={formData.fullName} name='fullName' type="text" placeholder="Фамилия и имя по паспорту*" />
                                    </div>

                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                       <label>Email</label>
                                       <input onChange={handleChange} value={formData.email} name='email' type="email" placeholder="Электронная почта" />
                                    </div>
                                 </div>
                              </div>

                              {/* Секция Способ оплаты */}
                              <div className={styles.section}>
                                 <h3 className={styles.sectionTitle}>Способ оплаты</h3>
                                 <div className={styles.paymentList}>
                                    {[
                                       { id: 'online', label: 'Картой онлайн' },
                                       { id: 'paypal', label: 'Онлайн-платежем PayPal' }
                                    ].map((item) => (
                                       <label key={item.id} className={styles.paymentItem}>
                                          <input
                                             type="radio"
                                             name="payment"
                                             value={item.id}
                                             checked={paymentMethod === item.id}
                                             onChange={(e) => setPaymentMethod(e.target.value)}
                                             className={styles.hiddenRadio}
                                          />
                                          <span className={styles.customRadio}>
                                             {paymentMethod === item.id && <span className={styles.radioInner} />}
                                          </span>
                                          <span className={styles.paymentLabel}>{item.label}</span>
                                       </label>
                                    ))}
                                 </div>
                              </div>

                              {/* Секция Дополнительно */}
                              <div className={styles.section}>
                                 <h3 className={styles.sectionTitle}>Дополнительно</h3>
                                 <div className={styles.commentWrapper}>
                                    <textarea
                                       onChange={handleChange} 
                                       value={formData.comment} 
                                       name='comment'
                                       placeholder="Комментарий к заказу"
                                       className={styles.textarea}
                                    />
                                 </div>

                                 <label className={styles.checkboxWrapper}>
                                    <input type="checkbox" className={styles.hiddenCheckbox} />
                                    <span className={styles.customCheckbox} />
                                    <span className={styles.checkboxLabel}>Сообщать мне об акциях и скидках</span>
                                 </label>

                                 <button className={styles.submitButton}>
                                    Перейти к оплате
                                 </button>

                                 <p className={styles.policyText}>
                                    Нажимая кнопку «Перейти к оплате», Вы соглашаетесь с <a>пользовательским соглашением</a> и <a>условиями доставки</a>
                                 </p>
                              </div>

                           </form>
                        )}

                        {deliveryMethod === 'post' && (
                           <form onSubmit={handleSubmit}>
                              {/* Сетка всех полей ввода */}
                              <div>
                                 <h3 className={styles.recipientAddressTitle}>Адрес получателя</h3>
                                 <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                       <label>Город доставки</label>
                                       <input onChange={handleChange} value={formData.city} name='city' type="text" placeholder="Город" />
                                    </div>

                                    <div className={`${styles.inputGroup}`}>
                                       <label>Улица</label>
                                       <input onChange={handleChange} value={formData.street} name='street' type="text" placeholder="ул. Ленина" />
                                    </div>

                                    <div className={styles.inputGroup}>
                                       <label>Дом</label>
                                       <input onChange={handleChange} value={formData.house} name='house' type="text" placeholder="Номер дома" />
                                    </div>

                                    <div className={styles.inputGroup}>
                                       <label>Квартира / Офис</label>
                                       <input onChange={handleChange} value={formData.apartment} name='apartment' type="text" placeholder="Номер квартиры" />
                                    </div>

                                    <div className={styles.inputGroup}>
                                       <label>Почтовый индекс</label>
                                       <input onChange={handleChange} value={formData.postIndex} name='postIndex' type="text" placeholder="Почтовый индекс" />
                                    </div>


                                    <div className={styles.inputGroup}>
                                       <label>Телефон</label>
                                       <input onChange={handleChange} value={formData.phone} name='phone' type="tel" placeholder="Телефон*" />
                                    </div>

                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                       <label>ФИО</label>
                                       <input onChange={handleChange} value={formData.fullName} name='fullName' type="text" placeholder="Фамилия и имя по паспорту*" />
                                    </div>

                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                       <label>Email</label>
                                       <input onChange={handleChange} value={formData.email} name='email' type="email" placeholder="Электронная почта" />
                                    </div>
                                 </div>
                              </div>

                              {/* Секция Способ оплаты */}
                              <div className={styles.section}>
                                 <h3 className={styles.sectionTitle}>Способ оплаты</h3>
                                 <div className={styles.paymentList}>
                                    {[
                                       { id: 'online', label: 'Картой онлайн' },
                                       { id: 'courier', label: 'Наличными курьеру' },
                                       { id: 'paypal', label: 'Онлайн-платежем PayPal' }
                                    ].map((item) => (
                                       <label key={item.id} className={styles.paymentItem}>
                                          <input
                                             type="radio"
                                             name="payment"
                                             value={item.id}
                                             checked={paymentMethod === item.id}
                                             onChange={(e) => setPaymentMethod(e.target.value)}
                                             className={styles.hiddenRadio}
                                          />
                                          <span className={styles.customRadio}>
                                             {paymentMethod === item.id && <span className={styles.radioInner} />}
                                          </span>
                                          <span className={styles.paymentLabel}>{item.label}</span>
                                       </label>
                                    ))}
                                 </div>
                              </div>

                              {/* Секция Дополнительно */}
                              <div className={styles.section}>
                                 <h3 className={styles.sectionTitle}>Дополнительно</h3>
                                 <div className={styles.commentWrapper}>
                                    <textarea
                                       onChange={handleChange} 
                                       value={formData.comment} 
                                       name='comment'
                                       placeholder="Комментарий к заказу"
                                       className={styles.textarea}
                                    />
                                 </div>

                                 <label className={styles.checkboxWrapper}>
                                    <input type="checkbox" className={styles.hiddenCheckbox} />
                                    <span className={styles.customCheckbox} />
                                    <span className={styles.checkboxLabel}>Сообщать мне об акциях и скидках</span>
                                 </label>

                                 <button className={styles.submitButton}>
                                    Перейти к оплате
                                 </button>

                                 <p className={styles.policyText}>
                                    Нажимая кнопку «Перейти к оплате», Вы соглашаетесь с <a>пользовательским соглашением</a> и <a>условиями доставки</a>
                                 </p>
                              </div>

                           </form>
                        )}

                        {deliveryMethod === 'self' && (
                           <form onSubmit={handleSubmit}>
                              {/* Сетка всех полей ввода */}
                              <div>
                                 <h3 className={styles.recipientAddressTitle}>Адрес получателя</h3>
                                 <div className={styles.formGrid}>
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                       <label>ФИО</label>
                                       <input onChange={handleChange} value={formData.fullName} name='fullName' type="text" placeholder="Фамилия и имя по паспорту*" />
                                    </div>

                                    <div className={`${styles.inputGroup}`}>
                                       <label>Email</label>
                                       <input onChange={handleChange} value={formData.email} name='email' type="email" placeholder="Электронная почта" />
                                    </div>

                                    <div className={styles.inputGroup}>
                                       <label>Телефон</label>
                                       <input onChange={handleChange} value={formData.phone} name='phone' type="tel" placeholder="Телефон*" />
                                    </div>

                                 </div>
                              </div>

                              {/* Секция Способ оплаты */}
                              <div className={styles.section}>
                                 <h3 className={styles.sectionTitle}>Способ оплаты</h3>
                                 <div className={styles.paymentList}>
                                    {[
                                       { id: 'online', label: 'Картой онлайн' },
                                       { id: 'courier', label: 'Наличными курьеру' },
                                       { id: 'on_delivery', label: 'Наличными при получении' },
                                       { id: 'paypal', label: 'Онлайн-платежем PayPal' }
                                    ].map((item) => (
                                       <label key={item.id} className={styles.paymentItem}>
                                          <input
                                             type="radio"
                                             name="payment"
                                             value={item.id}
                                             checked={paymentMethod === item.id}
                                             onChange={(e) => setPaymentMethod(e.target.value)}
                                             className={styles.hiddenRadio}
                                          />
                                          <span className={styles.customRadio}>
                                             {paymentMethod === item.id && <span className={styles.radioInner} />}
                                          </span>
                                          <span className={styles.paymentLabel}>{item.label}</span>
                                       </label>
                                    ))}
                                 </div>
                              </div>

                              {/* Секция Дополнительно */}
                              <div className={styles.section}>
                                 <h3 className={styles.sectionTitle}>Дополнительно</h3>
                                 <div className={styles.commentWrapper}>
                                    <textarea
                                       onChange={handleChange} 
                                       value={formData.comment} 
                                       name='comment'
                                       placeholder="Комментарий к заказу"
                                       className={styles.textarea}
                                    />
                                 </div>

                                 <label className={styles.checkboxWrapper}>
                                    <input type="checkbox" className={styles.hiddenCheckbox} />
                                    <span className={styles.customCheckbox} />
                                    <span className={styles.checkboxLabel}>Сообщать мне об акциях и скидках</span>
                                 </label>

                                 <button className={styles.submitButton}>
                                    Подтвердить заказ
                                 </button>

                                 <p className={styles.policyText}>
                                    Нажимая кнопку «Перейти к оплате», Вы соглашаетесь с <a>пользовательским соглашением</a> и <a>условиями доставки</a>
                                 </p>
                              </div>

                           </form>
                        )}
                     </div>
                  </div>
               </div>

               {/* Правая секция */}
               {/* Сайдбар с итогами */}
               <OrderSummary totalPrice={totalPrice} totalCount={totalCount} />
            </div>
         </div>
      </div>
   )
}

export default CheckoutPage
