import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import { Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updateUserProfile } from '../../redux/slices/authUserSlice';
import Loader from '../../components/Loader/Loader';

const ProfilePage = () => {
   const [isEditing, setIsEditing] = useState({
      name: false,
      phone: false,
      delivery_address: false,
      changePassword: false,
      oldPassword: false,
      newPassword: false,
      repeatPassword: false

   });
   const { user, loading } = useSelector(state => state.authUser);
   const [userData, setUserData] = useState({
      name: '',
      phone: '',
      email: '',
      delivery_address: '',
      avatar: '',
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
      newAvatar: ''
   });
   const dispatch = useDispatch();
   const specialCharacters = `~ ! @ # $ % ^ & * ( )`;

   // Добавляем этот блок:
   useEffect(() => {
      if (user) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setUserData({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email,
            delivery_address: user.delivery_address || '',
            avatar: user.avatar || ''
         });
      }
   }, [user]); // Как только user в Redux изменится, данные попадут в локальный стейт

   useEffect(() => {
      return () => {
         // Если аватар — это Blob-ссылка (начинается с blob:), удаляем её при размонтировании
         if (userData.avatar && userData.avatar.startsWith('blob:')) {
            URL.revokeObjectURL(userData.avatar);
         }
      };
   }, [userData.avatar]);

   const toggleEdit = useCallback((field) => {
      setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
   }, []);

   const handleChange = useCallback((e, field) => {
      setUserData(prev => ({ ...prev, [field]: e.target.value }));
   }, []);

   const handleChangeAvatar = useCallback((event) => {
      const file = event.target.files[0];
      if (file) {
         // Создаем временную ссылку для отображения
         const previewUrl = URL.createObjectURL(file);

         setUserData(prevData => ({ ...prevData, [event.target.name]: previewUrl, newAvatar: file }))
      }

   }, []);

   const handleSave = useCallback(async () => {
      const formData = new FormData();

      // Добавляем текстовые поля
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('delivery_address', userData.delivery_address);

      // Если пользователь меняет пароль
      if (userData.newPassword) {
         if (userData.newPassword !== userData.repeatPassword) {
            toast.error('Пароли не совпадают!');
            return;
         }
         formData.append('oldPassword', userData.oldPassword);
         formData.append('newPassword', userData.newPassword);
      };

      // Добавляем файл, если он был выбран (мы его сохранили в newAvatar)
      if (userData.newAvatar) {
         formData.append('newAvatar', userData.newAvatar);
      };

      try {
         const response = await dispatch(updateUserProfile(formData)).unwrap();
         toast.success(response.message)
         setUserData(prev => ({ ...prev, oldPassword: '', newPassword: '', repeatPassword: '' }))
      } catch (error) {
         toast.error(error.message)
      }

   }, [userData, dispatch])

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Личные данные</h1>

         <div className={styles.userHeader}>
            <div className={styles.avatar}>
               {
                  userData.avatar ? (
                     <label className={styles.avatarContainer} htmlFor="avatar">
                        <input onChange={handleChangeAvatar} type="file" name="avatar" id="avatar" />
                        <img src={userData.avatar} alt="avatar" />
                     </label>
                  ) : (
                     <label className={styles.avatarContainer} htmlFor="avatar">
                        <input onChange={handleChangeAvatar} type="file" name="avatar" id="avatar" />
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                           <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                     </label>
                  )
               }
            </div>
            <span className={styles.emailText}>{userData.email}</span>
         </div>

         {/* Имя */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Имя</span>
               <div className={styles.content}>
                  {isEditing.name ? (
                     <input
                        className={styles.inputField}
                        value={userData.name}
                        onChange={(e) => handleChange(e, 'name')}
                        onBlur={() => toggleEdit('name')}
                        autoFocus
                     />
                  ) : (
                     <>
                        <span className={styles.value}>{userData.name}</span>
                        <button className={styles.editBtn} onClick={() => toggleEdit('name')}>
                           <Pencil size={16} />
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* Телефон */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Телефон</span>
               <div className={styles.content}>
                  {isEditing.phone ? (
                     <input
                        className={styles.inputField}
                        placeholder="+7 (___) ___-__-__"
                        value={userData.phone}
                        onChange={(e) => handleChange(e, 'phone')}
                        onBlur={() => toggleEdit('phone')}
                        autoFocus
                     />
                  ) : (
                     <>
                        <button className={styles.addBtn} onClick={() => toggleEdit('phone')}>
                           {userData.phone ? <Pencil size={16} /> : 'Добавить'}
                        </button>
                     </>
                  )}
               </div>
            </div>
            <div>
               <span className={styles.value}>{userData.phone || ''}</span>
            </div>
         </div>

         {/* Адрес */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Адреса доставки</span>
            </div>
            <div>
               <div className={styles.content}>
                  {
                     isEditing.delivery_address ? (
                        <input
                           className={styles.inputField}
                           placeholder="Город, Улица, дом, кв"
                           value={userData.delivery_address}
                           onChange={(e) => handleChange(e, 'delivery_address')}
                           onBlur={() => toggleEdit('delivery_address')}
                           autoFocus
                        />
                     ) : (
                        <button className={styles.addBtn} onClick={() => toggleEdit('delivery_address')}>
                           {userData.delivery_address ? <Pencil size={16} /> : 'Добавить адрес'}
                        </button>
                     )
                  }
               </div>
               <span className={styles.value}>{userData.delivery_address || ''}</span>
            </div>

         </div>

         {/* Пароль */}
         <div className={styles.section} style={{ border: 'none' }}>
            <div className={styles.row}>
               <div className={styles.content}>
                  <button className={styles.editBtn}>
                     Изменить пароль
                  </button>
               </div>
            </div>
            <div className={styles.specialCharactersContainer}>
               <h5>Длина пароля должна быть минимум 12 символов из них как минимум 4 спецсимвола</h5>
               <span>{specialCharacters}</span>
            </div>
            <div className={styles.changePasswordContainer}>
               <div>
                  <input
                     className={styles.inputField}
                     type="password"
                     placeholder='Старый пароль'
                     value={userData.oldPassword}
                     onChange={(e) => handleChange(e, 'oldPassword')}
                  />
               </div>
               <div>
                  <input
                     className={styles.inputField}
                     type="password"
                     placeholder='Новый пароль'
                     value={userData.newPassword}
                     onChange={(e) => handleChange(e, 'newPassword')}

                  />
               </div>
               <div>
                  <input
                     className={styles.inputField}
                     type="password"
                     placeholder='Повторите новый пароль'
                     value={userData.repeatPassword}
                     onChange={(e) => handleChange(e, 'repeatPassword')}
                  />
               </div>
            </div>
         </div>

         <div>
            {
               loading ? (
                  <div className={styles.updateUserLoader}>
                     <Loader />
                  </div>
               ) : (
                  <button
                     className={styles.saveBtn}
                     onClick={handleSave}
                  >
                     Сохранить
                  </button>
               )
            }
         </div>
      </div>
   );
};

export default ProfilePage
