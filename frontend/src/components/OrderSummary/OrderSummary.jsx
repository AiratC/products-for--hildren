import React, { memo } from 'react'
import styles from './OrderSummary.module.css'
import { getProductWord } from '../../utils/declensionWord'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'antd'

const OrderSummary = memo(({ totalPrice, totalCount }) => {
   const { pathname } = useLocation();

   return (
      <aside className={styles.summaryCard}>
         <div className={styles.summaryInfo}>
            <div className={styles.promoSection}>
               <input type="text" placeholder="Промокод" className={styles.promoInput} />
               <button className={styles.promoBtn}>Применить</button>
            </div>

            <div className={styles.summaryRow}>
               <span>Количество ({totalCount}) {getProductWord(totalCount)}</span>
               <span>{totalPrice.toLocaleString()} ₽</span>
            </div>

            <div className={styles.summaryRow}>
               <span>Скидка</span>
               <span className={styles.discount}>0 ₽</span>
            </div>

            <hr className={styles.divider} />
            <div className={styles.totalRow}>
               <span>Итого</span>
               <span className={styles.totalPrice}>{totalPrice.toLocaleString()} ₽</span>
            </div>
         </div>

         {
            pathname === '/cart' && (
               <div>
                  <Link to={`/checkout`}>
                     <Button type="primary" size="large" block className={styles.checkoutBtn}>
                        Перейти к оформлению
                     </Button>
                  </Link>

                  <p className={styles.terms}>
                     Нажимая кнопку, вы соглашаетесь с правилами возврата и условиями продажи
                  </p>
               </div>
            )
         }
      </aside>
   )
})

export default OrderSummary
