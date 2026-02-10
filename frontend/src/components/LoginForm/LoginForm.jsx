import React, { useState } from 'react'
import styles from './LoginForm.module.css';
import { Link, useNavigate } from 'react-router-dom';


const LoginForm = ({ onClose }) => {
   const [formData, setFormData] = useState({
      email: '',
      password: ''
   });

   const navigate = useNavigate();

   const handleClickRegister = () => {
      navigate('/register');
      onClose();
   }

   const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevData => ({
         ...prevData,
         [name]: value
      }))
   };

   return (
      <div className={styles.login}>
         <div onClick={handleClickRegister}>
            <h3 className={styles.title}>Регистрация</h3>
         </div>
         <div className={styles.form}>
            <input onChange={handleChange} value={formData.email} name='email' type="email" placeholder="Электронный адрес" className={styles.input} />
            <input onChange={handleChange} value={formData.password} name='password' type="password" placeholder="Пароль" className={styles.input} />
            <div className={styles.footer}>
               <button className={styles.loginBtn}>Войти</button>
               <button className={styles.forgotBtn}>Забыли пароль?</button>
            </div>
         </div>
      </div>
   )
}

export default LoginForm
