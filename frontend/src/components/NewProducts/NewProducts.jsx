import { useEffect, useState } from 'react'
import fetchAxios from '../../utils/fetchAxios';
import Loader from '../Loader/Loader';
import Carousel from '../Carousel/Carousel';

const NewProducts = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Создаем контроллер для отмены запроса
      const controller = new AbortController();

      const fetchNewProducts = async () => {
         try {
            setLoading(true);
            const res = await fetchAxios.get(`/api/products/get-all-new-products`, {
               signal: controller.signal // Привязываем сигнал к запросу
            });
            if (res.data?.success) {
               setProducts(res.data.products);
            }
         } catch (error) {
            if(error.name !== 'CanceledError') {
               console.error('Ошибка при загрузке новинок: ', error)
            }
         } finally {
            setLoading(false)
         }
      }

      fetchNewProducts();

      // Функция очистки отменит запрос если компонент удплится
      return () => controller.abort();
   }, []);

   if (loading) {
      return (
         <div className={`preloader`}>
            <Loader />
         </div>
      )
   };

   if (products.length === 0) {
      return null
   };

   return (
         <Carousel products={products} titleSectionName={`Новинки`} />
   )
}

export default NewProducts
