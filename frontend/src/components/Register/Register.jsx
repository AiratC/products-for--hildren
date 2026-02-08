import React, { useCallback, useEffect, useState } from 'react'
import styles from './Register.module.css'
import fetchAxios from '../../utils/fetchAxios';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';


const Register = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      agree: false,
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
      if (!formData.agree) {
         return toast.error('Подтвердите согласие')
      }

      try {
         setLoading(true)
         const response = await fetchAxios.post(`/api/auth/register`, formData);
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
      <section className={styles.registerSection}>
         <div className='container'>
            <div className={styles.registerWrapper}>
               <h1 className={styles.title}>
                  Регистрация
               </h1>

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
                     <label htmlFor="password">Пароль</label>
                     <input
                        type="password"
                        name='password'
                        placeholder='Введите пароль'
                        value={formData.password}
                        id='password'
                        onChange={handleChange}
                     />
                  </div>

                  <div className={styles.inputGroup}>
                     <label htmlFor="repeatPassword">Повторите пароль</label>
                     <input
                        type="password"
                        name='repeatPassword'
                        placeholder='Повторите пароль'
                        value={formData.repeatPassword}
                        id='repeatPassword'
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
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                     />
                     <span>
                        Согласие с <a href="#">пользовательским соглашением</a> и <a href="#">политикой конфиденциальности</a>
                     </span>
                  </label>

                  {
                     !loading ? (
                        <button
                           type="submit"
                           className={`${styles.submitBtn}`}
                        >
                           Зарегистрироваться
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

export default Register
