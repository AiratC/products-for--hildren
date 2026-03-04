import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { ChevronRight, Heart } from 'lucide-react';
import fetchAxios from '../../utils/fetchAxios';
import styles from './ProductPage.module.css';
import Loader from '../../components/Loader/Loader';
import { RiStarSFill } from "react-icons/ri";
import getPaginationRange from '../../utils/paginationRange';
import ReviewModal from '../../components/ReviewModal/ReviewModal';

const ProductPage = () => {
   const { id } = useParams();
   const [product, setProduct] = useState(null);
   const [activeImage, setActiveImage] = useState(0);
   const [openSection, setOpenSection] = useState('description');
   const [loading, setLoading] = useState(false);
   const [reviews, setReviews] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);
   const [totalCount, setTotalCount] = useState(0);
   const [canReview, setCanReview] = useState(null);
   // стейт для ID позиции заказа
   const [availableOrderItemId, setAvailableOrderItemId] = useState(null);
   const range = getPaginationRange(currentPage, totalPages);
   const [isModalOpen, setIsModalOpen] = useState(false);

   // Загрузка самого товара
   useEffect(() => {
      const fetchProduct = async () => {
         try {
            setLoading(true);
            const { data } = await fetchAxios.get(`/api/products/get-product?productId=${id}`);
            setProduct(data.product);
         } catch (error) {
            console.error("Ошибка загрузки товара:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchProduct();
   }, [id]);

   // Загрузка отзывов (срабатывает при изменении id или страницы)
   const fetchAllReviews = useCallback(async () => {
         try {
            const { data } = await fetchAxios.get(`/api/reviews/get-all-reviews/${id}?page=${currentPage}`);
            setReviews(data.reviews || []);
            setTotalPages(data.totalPages || 0);
            setTotalCount(data.totalCount || 0);
         } catch (error) {
            console.error("Ошибка загрузки отзывов:", error);
         }
      }, [id, currentPage]);

   useEffect(() => {
      if (id) fetchAllReviews();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id, currentPage]);

   // Эффект для показа кнопки если пользователь после покупки не оставил отзыв
   useEffect(() => {
      const fetchCheckReview = async () => {
         // Проверяй наличие токена/юзера, чтобы не спамить впустую на бэк
         try {
            const { data } = await fetchAxios.get(`/api/reviews/check-review-eligibility?productId=${id}`);
            setCanReview(data.canReview);
            setAvailableOrderItemId(data.availableOrderItemId); // Сохраняем ID позиции
         } catch (err) {
            // Если 401 (не авторизован), просто сетим false
            setCanReview(false);
            console.log(err);
         }
      };

      if (id) fetchCheckReview();
   }, [id]);


   const toggleSection = useCallback((section) => {
      setOpenSection(prev => prev === section ? null : section);
   }, []);

   const handlePageChange = (page) => {
      if (typeof page === 'number' && page !== currentPage) {
         setCurrentPage(page);
         // Скроллим не в самый верх страницы, а к началу блока отзывов
         document.getElementById('tabs-start')?.scrollIntoView({ behavior: 'smooth' });
      }
   };

   const handleOpenReviewModal = useCallback(async (orderItemId) => {
      if(!orderItemId) return;
      setIsModalOpen(true);
   }, [])

   if (loading) return <div className="preloader"><Loader /></div>;
   if (!product) return <div>Товар не найден</div>;

   return (
      <div className={styles.containerProductPage}>
         <div className={styles.productMain}>
            <div className={styles.gallery}>
               <div className={styles.mainImageWrapper}>
                  <img
                     src={product.product_images?.[activeImage]}
                     alt={product.title}
                     className={styles.mainImage}
                  />
               </div>
            </div>

            <div className={styles.info}>
               <div className={styles.header}>
                  <span className={styles.article}>Артикул {product.article}</span>
                  <h1 className={styles.title}>{product.title}</h1>
                  <div className={styles.ratingRow}>
                     <div className={styles.starsContainer}>
                        <span className={styles.stars}>
                           {[...Array(5)].map((_, i) => (
                              <RiStarSFill key={i} className={styles.star} size={24} />
                           ))}
                        </span>
                        <span className={styles.noReviews}>
                           {totalCount > 0 ? `Отзывов: ${totalCount}` : 'Нет отзывов'}
                        </span>
                     </div>
                     <button className={styles.favoriteBtn}>
                        <Heart size={24} /> <span>В избранное</span>
                     </button>
                  </div>
               </div>

               <p className={styles.colorLabel}>Цвет товара: <b>Белый</b></p>

               <div className={styles.thumbnails}>
                  {product.product_images?.map((img, idx) => (
                     <div
                        key={idx}
                        className={`${styles.thumb} ${activeImage === idx ? styles.activeThumb : ''}`}
                        onClick={() => setActiveImage(idx)}
                     >
                        <img src={img} alt={`${product.title} ${idx}`} />
                     </div>
                  ))}
               </div>

               <div className={styles.priceSection}>
                  <span className={styles.price}>{Number(product.price).toLocaleString()} <span>₽</span></span>
               </div>

               <div className={styles.actions}>
                  <button className={styles.fastOrderBtn}>Быстрый заказ</button>
                  <button className={styles.addToCartBtn}>В корзину</button>
               </div>

               <div className={styles.deliveryInfo}>
                  <span>Ваш город: <b>Москва</b></span>
                  <a href="#delivery">Подробнее о доставке</a>
               </div>

               <div className={styles.foundCheaper}>
                  <span>Нашли дешевле?</span>
               </div>
            </div>
         </div>

         {/* Точка для скролла при пагинации */}
         <div className={styles.accordionContainer}>
            <div className={styles.accordionItem}>
               <button
                  className={openSection === 'description' ? styles.buttonActive : ''}
                  onClick={() => toggleSection('description')}>
                  Описание
               </button>
            </div>

            <div className={styles.accordionItem}>
               <button
                  className={openSection === 'specs' ? styles.buttonActive : ''}
                  onClick={() => toggleSection('specs')}>
                  Характеристики
               </button>
            </div>

            <div className={styles.accordionItem}>
               <button
                  className={openSection === 'reviews' ? styles.buttonActive : ''}
                  onClick={() => toggleSection('reviews')}>
                  Отзывы ({totalCount})
               </button>
            </div>
         </div>

         <div className={styles.tabContent}>
            {openSection === 'description' && (
               <div className={styles.accordionContent}>
                  <p className={styles.description}>{product.description}</p>
               </div>
            )}

            {openSection === 'specs' && (
               <div className={styles.accordionContent}>
                  <ol className={styles.characteristicsContainer}>
                     {product.characteristics && Object.values(product.characteristics).map((item, index) => (
                        <li key={index}>{item}</li>
                     ))}
                  </ol>
               </div>
            )}

            {openSection === 'reviews' && (
               <div>
                  {canReview && (
                     <button
                        className={styles.sendReview}
                        onClick={() => handleOpenReviewModal(availableOrderItemId)}
                     >
                        Оставить отзыв
                     </button>
                  )}

                  <div className={styles.accordionContent}>
                     {reviews.length === 0 ? (
                        <p>Отзывов пока нет. Станьте первым!</p>
                     ) : (
                        <>
                           <div className={styles.reviewsList}>
                              {reviews.map(review => (
                                 <div key={review.id} className={styles.reviewItem}>
                                    {/* Здесь верстка одного отзыва */}
                                    <p>{review.comment}</p>
                                 </div>
                              ))}
                           </div>

                           {totalPages > 1 && (
                              <div className={styles.pagination}>
                                 {range.map((page, index) => (
                                    <button
                                       key={index}
                                       className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''} ${page === '...' ? styles.dots : ''}`}
                                       onClick={() => handlePageChange(page)}
                                       disabled={page === '...'}
                                    >
                                       {page}
                                    </button>
                                 ))}
                                 {currentPage < totalPages && (
                                    <button className={styles.nextBtn} onClick={() => handlePageChange(currentPage + 1)}>
                                       Дальше <ChevronRight size={18} />
                                    </button>
                                 )}
                              </div>
                           )}
                        </>
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* Модальное окно для отзыва */}
         <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            productId={id}
            orderItemId={availableOrderItemId}
            onReviewSuccess={() => {
               setCanReview(false);
               fetchAllReviews();
            }}
         />
      </div>
   );
};

export default ProductPage;