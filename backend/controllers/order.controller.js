import { query } from "../config/db.js";


export const createOrder = async (req, res) => {
   const {
      payment_method, delivery_method, choosing_transport_company, order_items,
      recipient_address, total_amount, contact_info, comment_the_order
   } = req.body;
   const userId = req.userId;

   const { fullName, phone, email } = contact_info;
   const { city, street, house, apartment, postIndex } = recipient_address

   if (payment_method === 'paypal' || payment_method === 'card') {
      return res.status(400).json({
         message: 'Оплата онлайн временно не работает'
      });
   };

   // ------------------------------------------------------------------------------------

   // Проверка ввода данных
   if (!payment_method) {
      return res.status(400).json({
         message: 'Выберите способ оплаты'
      })
   };

   if (delivery_method === 'post' && !postIndex) {
      return res.status(400).json({
         message: 'Укажите почтовый индекс'
      })
   };

   if (
      (!fullName && delivery_method !== 'self') ||
      (!phone && delivery_method !== 'self') ||
      (!email && delivery_method !== 'self') ||
      (!city && delivery_method !== 'self') ||
      (!street && delivery_method !== 'self') ||
      (!house && delivery_method !== 'self') ||
      (!apartment && delivery_method !== 'self')
   ) {
      return res.status(400).json({
         message: 'Заполните все поля адреса'
      })
   }

   try {
      await query('BEGIN');

      // ------------------------------------------------------------------------------------ 

      // ПОДСЧЕТ СУММЫ ИЗ БАЗЫ ДАННЫХ
      let serverTotalAmount = 0;
      const verifiedOrderItems = [];

      for (const item of order_items) {
         // Запрашиваем актуальный товар из БД
         const productResult = await query(
            `
               SELECT price FROM products WHERE product_id = $1
            `,
            [item.product_id]
         );

         if (productResult.rows.length === 0) {
            throw new Error(`Товар с ID ${item.product_id} не найден`);
         };

         const actualPrice = productResult.rows[0].price;

         serverTotalAmount += actualPrice * item.quantity;

         // Формируем проверенный объект для записи в order_items
         verifiedOrderItems.push({
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: actualPrice
         })

      }

      // ------------------------------------------------------------------------------------

      // 1. Создаем заказ со статусом 'pending_payment' или 'cash_payment'
      const paymentStatus = (payment_method === 'card' || payment_method === 'paypal')
         ? 'pending_payment'
         : 'cash_payment';

      // Статус заказа
      const orderStatus = 'new';

      // Адрес получателя JSONB в БД
      const recipientAddress = typeof recipient_address === 'string' ? recipient_address : JSON.stringify(recipient_address);

      // Технические детали транзакции
      let paymentInfo = null;

      // Контактная информация JSONB в БД
      const contactInfo = typeof contact_info === 'string' ? contact_info : JSON.stringify(contact_info);


      // ------------------------------------------------------------------------------------
      // Создаем заказ с нашей вычисленной суммой serverTotalAmount
      const orderResult = await query(
         `INSERT INTO orders 
         (
            user_id, payment_method, payment_status, order_status, delivery_method,
            choosing_transport_company, recipient_address, total_amount,
            payment_info, contact_info, comment_the_order
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING order_id`,
         [
            userId, payment_method, paymentStatus, orderStatus, delivery_method,
            choosing_transport_company, recipientAddress, serverTotalAmount,
            paymentInfo, contactInfo, comment_the_order
         ]
      );

      // Получаем order_id заказа
      const orderId = orderResult.rows[0].order_id;

      // 2. Сохраняем товары (привязываем к orderId)
      for (const item of verifiedOrderItems) {
         await query(
            `
               INSERT INTO Order_items (order_id, product_id, quantity, price_at_purchase)
               VALUES ($1, $2, $3, $4)
            `, [orderId, item.product_id, item.quantity, item.price_at_purchase])
      };

      // 3. Логика оплаты PayPal
      if (payment_method === 'paypal') {
         // Здесь вызываем API платёжной системы (Stripe, PayPal, ЮMoney и т.д)
         // Здесь вызываем PayPal API, передавая serverTotalAmount
         // const paymentSession = await paypal.createOrder(serverTotalAmount);

         await query('COMMIT');
         return res.status(200).json({
            message: 'Оплата paypal временно не работает',
            orderId,
            total: serverTotalAmount // возвращаем фронтенду итоговую сумму
         });

      }

      // 4. Логика оплаты банковской картой
      if (payment_method === 'card') {
         // Тут оплата картой
         await query('COMMIT');
         return res.status(200).json({
            orderId,
            total: serverTotalAmount,
            message: 'Оплата картой временно не работает'
         })
      };

      // 5. Логика наличных
      if (payment_method === 'cash_courier' || payment_method === 'cash_on_delivery') {
         // Очищаем корзину сразу, так как заказ подтвержден
         await query(`DELETE FROM cart WHERE user_id = $1`, [userId]);
         await query('COMMIT');

         return res.status(201).json({
            message: 'Заказ успешно создан',
            orderId
         })
      }

   } catch (error) {
      await query('ROLLBACK');
      return res.status(500).json({
         message: 'Ошибка при оплате на сервере',
         error: error
      });
   };
};