import React, { useEffect, useMemo, useState } from 'react'
import { Menu as AntMenu, Spin } from 'antd';
import {
   AppstoreOutlined,
   ShoppingOutlined,
   RocketOutlined,
   MessageOutlined,
   UserOutlined
} from '@ant-design/icons';
import { MdCategory } from "react-icons/md";
import { fetchAxios } from '../../../utils/fetchAxios';
import { useNavigate } from 'react-router-dom';

const STATIC_MENU_ITEMS = [
   { key: 'blog', label: 'Блог', icon: <MessageOutlined /> },
   { key: 'orders', label: 'Заказы', icon: <ShoppingOutlined /> },
   { key: 'opt', label: 'ОПТ Клиенты', icon: <RocketOutlined /> },
   { key: 'category', label: 'Категории', icon: <MdCategory /> },
   { key: 'admin-profile', label: 'Админка', icon: <UserOutlined /> },
]

const Menu = () => {
   const [catalogData, setCatalogData] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();


   useEffect(() => {
      // ОТменяем запрос если компонент размонтироваля
      let isMounted = true;

      const fetchMenu = async () => {
         try {
            const response = await fetchAxios.get(`/api/catalog/menu-structure`);
            if (isMounted) {
               setCatalogData(response.data || []);
            }

         } catch (error) {
            console.error('Ошибка загрузки меню', error)
         } finally {
            if (isMounted) setLoading(false);
         }
      }

      fetchMenu()
      return () => { isMounted = false; }
   }, [])

   // Формируем итоговый массив
   const menuItems = useMemo(() => {
      const dynamicCatalog = {
         key: `catalog-root`,
         label: `Каталог`,
         icon: <AppstoreOutlined />,
         // Показываем children только если они реально пришли с базы данных
         children: catalogData.length > 0 ? catalogData : undefined,
      }

      return [dynamicCatalog, ...STATIC_MENU_ITEMS]

   }, [catalogData])


   const onClick = (e) => {
      console.log('Нажали на:', e.key);
      navigate(`${e.key}`)
   };

   if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin style={{ margin: '20px' }} /></div>
   }

   return (
      <AntMenu
         onClick={onClick}
         mode="inline"
         theme="dark" // или light
         items={menuItems}
         style={{ borderRight: 0 }}
      />
   );
}

export default Menu
