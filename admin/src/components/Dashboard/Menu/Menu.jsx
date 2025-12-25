import React, { useState } from 'react'
import styles from './Menu.module.css'
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { Menu as AntMenu } from 'antd';
import {
   AppstoreOutlined,
   ShoppingOutlined,
   RocketOutlined,
   HeartOutlined,
   MessageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const Menu = () => {
   const navigate = useNavigate();

   // Конфигурация пунктов меню
   const items = [
      {
         key: 'catalog',
         label: 'Каталог',
         icon: <AppstoreOutlined />,
         children: [
            {
               key: 'stock',
               label: 'Акции',
               children: [
                  { key: 'shoes', label: 'Обувь' },
                  { key: 'jackets', label: 'Куртки' },
               ]
            },
            {
               key: 'children-furniture',
               label: 'Детская мебель',
               children: [
                  { key: 'cribs', label: 'Кроватки' },
                  { key: 'cradles', label: 'Люльки' },
                  { key: 'changing-tables', label: 'Пеленальные комоды' },
                  { key: 'wardrobes', label: 'Шкафы' },
                  { key: 'accessories', label: 'Аксессуары' }
               ]
            },
            { key: 'strollers', label: 'Коляски' },
            { key: 'сar-seats', label: 'Автокресла' },
            { key: 'сloth', label: 'Одежда' },
            { key: 'feeding', label: 'Кормление' },
            { key: 'hygiene-and-care', label: 'Гигиена и уход' },
            { key: 'smart-toys', label: 'Умные игрушки' },
         ]
      },
      { key: 'blog', label: 'Блог', icon: <MessageOutlined /> },
      { key: 'orders', label: 'Заказы', icon: <ShoppingOutlined /> },
      { key: 'opt', label: 'ОПТ Клиенты', icon: <RocketOutlined /> },
   ]

   const onClick = (e) => {
      console.log('Нажали на:', e.key);
      // Здесь можно делать navigate(`/admin/${e.key}`)
   };

   return (
      <AntMenu
         onClick={onClick}
         mode="inline"
         theme="dark" // или light
         items={items}
         style={{ borderRight: 0 }}
      />
   );
}

export default Menu
