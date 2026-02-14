import { useCallback, useState } from 'react'
import styles from './LoginForm.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../redux/slices/authUserSlice';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';


const LoginForm = ({ onClose }) => {
   const [formData, setFormData] = useState({
      email: '',
      password: ''
   });
   const { loading } = useSelector((state) => state.authUser);
   const dispatch = useDispatch();

   const navigate = useNavigate();

   const handleClickRegister = useCallback(() => {
      navigate('/register');
      onClose();
   }, [onClose, navigate])

   const handleChange = useCallback((event) => {
      const { name, value } = event.target;
      setFormData(prevData => ({
         ...prevData,
         [name]: value
      }))
   }, []);

   // Вход
   const handleLogin = useCallback(async (e) => {
      e.preventDefault();

      try {
         // unwrap() позволяет поймать ошибку из Thunk в блоке catch
         const result = await dispatch(userLogin(formData)).unwrap();
         onClose();
         toast.success(result.message);
         navigate('/')
      } catch (error) {
         toast.error(error.message || 'Ошибка при входе!');
      }
   }, [dispatch, formData, onClose, navigate])


   return (
      <div className={styles.login}>
         <div onClick={handleClickRegister}>
            <h3 className={styles.title}>Регистрация</h3>
         </div>
         <form onSubmit={handleLogin} className={styles.form}>
            <input onChange={handleChange} value={formData.email} name='email' type="email" placeholder="Электронный адрес" className={styles.input} />
            <input onChange={handleChange} value={formData.password} name='password' type="password" placeholder="Пароль" className={styles.input} />
            <div className={styles.footer}>
               {
                  loading ? (
                     <div className={`${styles.loginLoader}`}>
                        <Loader />
                     </div>
                  ) : (
                     <button type='submit' className={styles.loginBtn}>
                        Войти
                     </button>
                  )
               }
               <button type='button' className={styles.forgotBtn}>Забыли пароль?</button>
            </div>
         </form>
      </div>
   )
}

export default LoginForm
