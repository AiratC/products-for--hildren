import { Button, Card, Form, Input, message } from 'antd'
import React from 'react'
import styles from './Login.module.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../../redux/slices/authAdminSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
   const { loading } = useSelector((state) => state.authAdmin);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   
   const onFinish = async (values) => {
      console.log(values)
      try {
         // unwrap() заставляет промис выбросить настоящую ошибку, если запрос не удался
         const result =  await dispatch(adminLogin(values)).unwrap();
         if(result.success) {
            message.success(`Добро пожаловать, ${result.user.name}`);
            navigate('/dashboard');
         }
      } catch (error) {
         console.log(error);
         message.error(error || 'Ошибка авторизации')
      }
   }

   return (
      <div className={styles.loginContainer}>
         <Card title='Вход в админ панель' style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Form
               name='login_form'
               layout='vertical'
               onFinish={onFinish}
            >
               <Form.Item
               name={`email`}
               label='Email'
               rules={[
                  {required: true, message: 'Введите ваш email!'},
                  {type: 'email', message: 'Введите корректный email!'}
               ]}
               >
                  <Input prefix={<UserOutlined/>} placeholder='admin@email.com' size='large'/>
               </Form.Item>

               <Form.Item
                  name={`password`}
                  label="Пароль"
                  rules={[{required: true, message: 'Введите пароль!'}]}
               >
                  <Input.Password prefix={<LockOutlined/>} placeholder='*********' size='large'/>
               </Form.Item>

               <Form.Item>
                  <Button type='primary' htmlType='submit' block size='large' loading={loading}>
                     Войти
                  </Button>
               </Form.Item>
            </Form>
         </Card>
      </div>
   )
}

export default Login
