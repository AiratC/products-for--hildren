import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { Menu as AntMenu, Spin } from 'antd';
import {
   AppstoreOutlined,
   ShoppingOutlined,
   RocketOutlined,
   HeartOutlined,
   MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchAxios } from '../../../utils/fetchAxios';


const Menu = () => {
   const [menuItems, setMenuItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchMenu = async () => {
         try {
            const response = await fetchAxios.get(`/api/catalog/menu-structure`);

            // Собираем финальный массив с фиксированными пунктами (Заказы, Блог) + данные из БД
            const dynamicCatalog = {
               key: `catalog-root`,
               label: `Каталог`,
               icon: <AppstoreOutlined />,
               children: response.data
            }

            setMenuItems([
               dynamicCatalog,
               { key: 'blog', label: 'Блог', icon: <MessageOutlined /> },
               { key: 'orders', label: 'Заказы', icon: <ShoppingOutlined /> },
               { key: 'opt', label: 'ОПТ Клиенты', icon: <RocketOutlined /> },
            ])
         } catch (error) {
            console.error('Ошибка загрузки меню', error)
         } finally {
            setLoading(false)
         }
      }

      fetchMenu()
   }, [])


   const onClick = (e) => {
      console.log('Нажали на:', e.key);
      // Здесь можно делать navigate(`/admin/${e.key}`)
   };

   if(loading) {
      return <div style={{ textAlign: 'center' }}><Spin style={{  margin: '20px'}}/></div>
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
