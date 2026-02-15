import React, { useEffect, useMemo } from 'react';
import styles from './CartPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '../../components/CartItem/CartItem';
import { Button } from 'antd';
import { fetchCart } from '../../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { getProductWord } from '../../utils/declensionWord';
import OrderSummary from '../../components/OrderSummary/OrderSummary';

const CartPage = () => {
   const { cartItems, isFetching } = useSelector((state) => state.cart);
   const dispatch = useDispatch();

   const totalCount = useMemo(() => {
      return cartItems.reduce((sum, item) => (sum + Number(item.quantity)), 0)
   }, [cartItems]);

   const totalPrice = useMemo(() => {
      return cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)
   }, [cartItems]);



   useEffect(() => {
      dispatch(fetchCart());
   }, [dispatch]);

   if (cartItems.length === 0 && isFetching) {
      return (
         <div className='preloader'>
            <Loader />
         </div>
      )
   }

   if (cartItems.length === 0) {
      return (
         <div className={styles.emptyContainer}>
            <h2>Ваша корзина пуста</h2>
            <Link to={`/`}>
               <button>На главную</button>
            </Link>
         </div>
      );
   }

   return (
      <div className={`${styles.cartContainer}`}>
         <h1 className={styles.title}>В корзине {totalCount} {getProductWord(totalCount)}</h1>

         <div className={styles.layout}>
            {/* Левая часть список товаров */}
            <div className={styles.itemsList}>
               {
                  cartItems.map((item) => (
                     <CartItem key={item.product_id} data={item} />
                  ))
               }
            </div>

            {/* Правая часть оформление (Order Summary) */}
            <OrderSummary totalPrice={totalPrice} totalCount={totalCount}/>
         </div>
      </div>
   )
}

export default CartPage
