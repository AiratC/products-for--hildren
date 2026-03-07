import { useCallback, useEffect, useState } from 'react'
import styles from './WholesaleCustomers.module.css'
import { useNavigate } from 'react-router';
import fetchAxios from '../../utils/fetchAxios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/Loader';

const WholesaleCustomers = () => {
   const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      city: '',
      is_agree: false,
      captcha: ''
   });

   const [captcha, setCaptcha] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const fetchCaptcha = useCallback(async () => {
      try {
         const response = await fetchAxios.get(`/api/captcha/get-captcha`);
         if (response.data.success) {
            setCaptcha(response.data.captcha)
         }
      } catch (error) {
         console.log(error)
      }
   }, [])

   // Получаем каптчу
   useEffect(() => {
      fetchCaptcha();
   }, [fetchCaptcha])

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;

      setFormData(prev => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value
      }))
   }

   const handleFormSubmit = async (event) => {
      event.preventDefault()
      if (!formData.is_agree) {
         return toast.error('Подтвердите согласие')
      }

      try {
         setLoading(true);
         const response = await fetchAxios.post(`/api/wholesale-customers/wholesale-request`, formData);
         if (response.data.success) {
            toast.success(response.data.message);
            navigate('/')
         }
      } catch (error) {
         toast.error(error.response.data.message)
         
         fetchCaptcha();
         setFormData(prev => ({ ...prev, captcha: '' }))
      } finally {
         setLoading(false)
      }
   }

   return (
      <section className={styles.wholesaleCustomersSection}>
         <div className='container'>
            <div className={styles.wholesaleCustomersWrapper}>
               <h1 className={styles.title}>
                  Оптовым клиентам
               </h1>
               <p className={styles.text}>Заполните форму и мы отправим Вам выгодные условия партнерства</p>

               <form onSubmit={handleFormSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                     <label htmlFor="name">Имя</label>
                     <input
                        type="text"
                        name='name'
                        placeholder='Введите имя..'
                        value={formData.name}
                        id='name'
                        onChange={handleChange}
                     />
                  </div>

                  <div className={styles.inputGroup}>
                     <label htmlFor="phone">Телефон</label>
                     <input
                        type="phone"
                        name='phone'
                        placeholder='Введите +7 900 456 9665'
                        value={formData.phone}
                        id='phone'
                        onChange={handleChange}
                     />
                  </div>

                  <div className={styles.inputGroup}>
                     <label htmlFor="email">Электронный адрес</label>
                     <input
                        type="email"
                        name='email'
                        placeholder='example@mail.com'
                        value={formData.email}
                        id='email'
                        onChange={handleChange}
                     />
                  </div>

                  <div className={styles.inputGroup}>
                     <label htmlFor="city">Город</label>
                     <input
                        type="text"
                        name='city'
                        placeholder='Введите город'
                        value={formData.city}
                        id='city'
                        onChange={handleChange}
                     />
                  </div>

                  <div className={styles.containerCaptcha}>
                     <div className={styles.captchaPlaceholder}>
                        <span>Вставить капчу</span>
                     </div>
                     <div
                        onClick={fetchCaptcha}
                        title='Нажмите, чтобы обновить'
                        dangerouslySetInnerHTML={{ __html: captcha }}
                     >
                     </div>
                  </div>

                  <div className={styles.inputGroup}>
                     <label htmlFor="captcha">Капча</label>
                     <input
                        type="text"
                        name='captcha'
                        placeholder='Введите код с картинки'
                        value={formData.captcha}
                        id='captcha'
                        autoComplete='off'
                        onChange={handleChange}
                     />
                  </div>



                  <label className={styles.checkboxLabel}>
                     <input
                        type="checkbox"
                        name="is_agree"
                        checked={formData.is_agree}
                        onChange={handleChange}
                     />
                     <span>
                        Согласие с <a >пользовательским соглашением</a> и <a >политикой конфиденциальности</a>
                     </span>
                  </label>

                  {
                     !loading ? (
                        <button
                           type="submit"
                           className={`${styles.submitBtn}`}
                        >
                           Отправить
                        </button>
                     ) : (
                        <div className={`smallLoaderContainer`}>
                           <Loader />
                        </div>
                     )
                  }

               </form>
            </div>
         </div>
      </section>
   )
}

export default WholesaleCustomers
