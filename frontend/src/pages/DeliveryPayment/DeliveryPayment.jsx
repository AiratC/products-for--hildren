import React, { useState } from 'react';
import styles from './DeliveryPayment.module.css';

const DeliveryPayment = () => {
   const [activeTab, setActiveTab] = useState('payment'); // 'payment' или 'delivery'

   return (
      <div className={styles.container}>
         <h1 className={styles.mainTitle}>Оплата и доставка</h1>

         {/* Переключатель вкладок */}
         <div className={styles.tabSwitcher}>
            <button
               className={`${styles.tabBtn} ${activeTab === 'payment' ? styles.active : ''}`}
               onClick={() => setActiveTab('payment')}
            >
               Оплата
            </button>
            <button
               className={`${styles.tabBtn} ${activeTab === 'delivery' ? styles.active : ''}`}
               onClick={() => setActiveTab('delivery')}
            >
               Доставка
            </button>
         </div>

         <div className={styles.content}>
            {activeTab === 'payment' ? <PaymentContent /> : <DeliveryContent />}
         </div>
      </div>
   );
};

// Внутренний компонент для контента оплаты
const PaymentContent = () => (
   <>
      <div className={styles.gridSection}>
         <div className={styles.column}>
            <h3>Варианты оплаты г. Москва</h3>
            <ol>
               <li>Оплата товара курьеру наличными при доставке;</li>
               <li>Оплата товара курьеру с помощью банковских карт Visa/MasterCard/МИР без комиссии;</li>
               <li>Оплата товара по счету для физических и юридических лиц...</li>
            </ol>
         </div>
         <div className={styles.column}>
            <h3>Варианты оплаты регионы России</h3>
            <ol>
               <li>Оплата товара онлайн через сайт с помощью карт Visa/MasterCard/МИР;</li>
               <li>Оплата товара по счету для физических и юридических лиц...</li>
            </ol>
         </div>
      </div>

      <section className={styles.textBlock}>
         <h3>Оплата банковской картой на сайте</h3>
         <p>Оплата производится непосредственно на сайте в режиме online...</p>
         <p className={styles.details}>Для оплаты потребуется: номер карты, ФИО владельца, срок действия и CVV/CVC код.</p>
      </section>

      <section className={styles.textBlock}>
         <h3>Банковский перевод</h3>
         <p>Оплата за заказ производится банковским платежным поручением на расчетный счет магазина.</p>
      </section>
   </>
);

const DeliveryContent = () => (
   <div className={styles.textBlock}>
      <h3>Доставка по Москве и МО</h3>
      <p>Здесь будет информация о сроках и стоимости доставки курьером...</p>
   </div>
);

export default DeliveryPayment;