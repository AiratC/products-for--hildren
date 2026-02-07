import React from 'react'
import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';


const LoginForm = () => {

   return (
      <div className={styles.login}>
         <Link to={`/register`}>
            <h3 className={styles.title}>Регистрация</h3>
         </Link>
         <div className={styles.form}>
            <input type="email" placeholder="Электронный адрес" className={styles.input} />
            <input type="password" placeholder="Пароль" className={styles.input} />
            <div className={styles.footer}>
               <button className={styles.loginBtn}>Войти</button>
               <button className={styles.forgotBtn}>Забыли пароль?</button>
            </div>
         </div>
      </div>
   )
}

export default LoginForm
