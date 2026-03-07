import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { ChevronRight, Search } from 'lucide-react';
import fetchAxios from '../../utils/fetchAxios';
import styles from './ProductPage.module.css';
import Loader from '../../components/Loader/Loader';
import getPaginationRange from '../../utils/paginationRange';
import ReviewModal from '../../components/ReviewModal/ReviewModal';
import ReviewItem from '../../components/ReviewItem/ReviewItem';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAction } from '../../redux/slices/favoriteSlice';
import toast from 'react-hot-toast';
import { updateCartAction } from '../../redux/slices/cartSlice';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import RatingStars from '../../components/RatingStars/RatingStars';

const ProductPage = () => {
   const params = useParams();
   const id = Number(params.id)
   const [product, setProduct] = useState(null);
   const [activeImage, setActiveImage] = useState(0);
   const [openSection, setOpenSection] = useState('description');
   const [loadingProductPage, setLoadingProductPage] = useState(false);
   const [loadingReview, setLoadingReview] = useState(false);
   const [reviews, setReviews] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);
   const [totalCount, setTotalCount] = useState(0);
   const [canReview, setCanReview] = useState(null);
   // стейт для ID позиции заказа
   const [availableOrderItemId, setAvailableOrderItemId] = useState(null);
   const range = getPaginationRange(currentPage, totalPages);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [averageRating, setAverageRating] = useState(null);
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
   const [isCheaperModalOpen, setIsCheaperModalOpen] = useState(false);
   const [cheaperFormData, setCheaperFormData] = useState({
      link: '',
      phone: ''
   });
   const [cheaperLoading, setCheaperLoading] = useState(false)

   const dispatch = useDispatch();

   const { loading, items } = useSelector((state) => state.favorites);
   const { loadingId, cartItems } = useSelector((state) => state.cart);

   // Проверяем загрузку именно ДЛЯ ЭТОЙ карточки
   const isThisProductFavoriteLoading = loading === id;

   // Проверяем загрузку именно для этой карточки - добавление, прибавление, уменьшение товара в корзине
   const isThisProductCartLoading = loadingId === id;

   // Проверяем, в избранном ли товар
   const isFavorite = items.includes(id);

   // Ищем есть ли этот товар в корзине
   const inCart = cartItems.find(item => item.product_id === id);

   // Изброннаое
   const handleFavorite = useCallback(async (event) => {
      event.stopPropagation();

      try {
         const result = await dispatch(toggleFavoriteAction({ productId: id })).unwrap()
         toast.success(result.message);
      } catch (error) {
         toast.error(error.message)
      }
   }, [dispatch, id])

   // Корзина
   const handleClickCart = useCallback(async (e, productId, action) => {
      e.stopPropagation();
      const data = { productId: productId, action: action }
      try {
         switch (action) {
            case 'add': {
               const response = await dispatch(updateCartAction(data)).unwrap();
               toast.success(response.message)
               break;
            };
            case 'decrement': {
               const response = await dispatch(updateCartAction(data)).unwrap();
               toast.success(response.message)
               break;
            };
            case 'increment': {
               const response = await dispatch(updateCartAction(data)).unwrap();
               toast.success(response.message)
               break;
            }
         }
      } catch (error) {
         toast.error(error.message)
      }

   }, [dispatch]);

   useEffect(() => {
      window.scrollTo(0, 0)
   }, [])

   // Загрузка самого товара
   useEffect(() => {
      const fetchProduct = async () => {
         try {
            setLoadingProductPage(true);
            const { data } = await fetchAxios.get(`/api/products/get-product?productId=${id}`);
            setProduct(data.product);

            // Сбрасываем страницу на 1-ю при смене товара
            setCurrentPage(1);
         } catch (error) {
            console.error("Ошибка загрузки товара:", error);
         } finally {
            setLoadingProductPage(false);
         }
      };
      fetchProduct();
   }, [id]);

   // Загрузка отзывов (срабатывает при изменении id или страницы)
   const fetchAllReviews = useCallback(async () => {
      try {
         setLoadingReview(true)
         const { data } = await fetchAxios.get(`/api/reviews/get-all-reviews/${id}?page=${currentPage}`);
         setReviews(data.reviews || []);
         setTotalPages(data.totalPages || 0);
         setTotalCount(data.totalCount || 0);
         setAverageRating(data.averageRating);
      } catch (error) {
         console.error("Ошибка загрузки отзывов:", error);
      } finally {
         setLoadingReview(false)
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
      if (!orderItemId) return;
      setIsModalOpen(true);
   }, []);

   // Функция открытия модалки изображения
   const handleZoomClick = useCallback(() => {
      setIsImageModalOpen(true);
      // Блокируем скролл основной страницы при открытой модалке
      document.body.style.overflow = 'hidden';
   }, []);

   // Функция закрытия модалки изображения
   const closeImageModal = useCallback(() => {
      setIsImageModalOpen(false);
      document.body.style.overflow = 'auto';
   }, [])

   // Функция открытия модалки нашли дешевле
   const handleOpenCheaperModal = useCallback(() => {
      setIsCheaperModalOpen(true);
      // Блокируем скролл основной страницы при открытой модалке
      document.body.style.overflow = 'hidden';
   }, []);

   // Функция закрытия модалки нашли дешевле
   const handleCloseCheaperModal = useCallback(() => {
      setIsCheaperModalOpen(false);
      document.body.style.overflow = 'auto';
   }, []);

   const handleFormCheaper = useCallback(async (event) => {
      event.preventDefault();
      try {
         setCheaperLoading(true);
         const response = await fetchAxios.post('/api/products/found-cheaper', {
            link: cheaperFormData.link,
            phone: cheaperFormData.phone,
            productId: id // id товара из useParams
         });

         if (response.data.success) {
            toast.success(response.data.message);
            handleCloseCheaperModal();
            setCheaperFormData({ link: '', phone: '' }); // Очистка формы
         }
      } catch (error) {
         toast.error(error.response?.data?.message || 'Ошибка отправки');
      } finally {
         setCheaperLoading(false);
      }
   }, [cheaperFormData, handleCloseCheaperModal, id])

   if (loadingProductPage) return <div className="preloader"><Loader /></div>;
   if (!product) return <div>Товар не найден</div>;

   return (
      <div className={styles.containerProductPage}>
         <div className={styles.productMain}>
            <div className={styles.gallery}>
               <div className={styles.mainImageWrapper} onClick={handleZoomClick}>
                  <img
                     src={product.product_images?.[activeImage]}
                     alt={product.title}
                     className={styles.mainImage}
                  />
                  {/* Кнопка увеличить, которая видна при наведении на десктопе */}
                  <div className={styles.zoomBadge}>
                     <Search size={20} />
                     <span>Увеличить</span>
                  </div>
               </div>
            </div>

            <div className={styles.info}>
               <div className={styles.header}>
                  <span className={styles.article}>Артикул {product.article}</span>
                  <h1 className={styles.title}>{product.title}</h1>
                  <div className={styles.ratingRow}>
                     <div className={styles.starsContainer}>
                        <RatingStars rating={averageRating} size={24} />
                        <span className={styles.noReviews}>
                           {totalCount > 0 ? `Отзывов: ${totalCount}` : 'Нет отзывов'}
                        </span>
                     </div>
                     <div className={styles.favoriteLoaderContainer}>
                        {
                           isThisProductFavoriteLoading ? (
                              <div className={styles.favoriteLoader}>
                                 <Loader />
                              </div>
                           ) : (
                              <button onClick={(e) => handleFavorite(e)} className={styles.favoriteBtn}>
                                 {
                                    isFavorite ? (
                                       <AiFillHeart size={25} color='#5bc0de' />
                                    ) : (
                                       <AiOutlineHeart size={25} />
                                    )
                                 }
                                 <span>В избранное</span>
                              </button>
                           )
                        }
                     </div>


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
                  <div>
                     <button className={styles.fastOrderBtn}>Быстрый заказ</button>
                  </div>

                  <div >
                     <div className={styles.actions}>
                        {
                           !inCart ? (
                              <div className={styles.cartLoaderContainer}>
                                 {
                                    isThisProductCartLoading ? (
                                       <div className={styles.cartLoader}>
                                          <Loader />
                                       </div>
                                    ) : (
                                       <button
                                          className={styles.buyBtn}
                                          onClick={(e) => handleClickCart(e, id, 'add')}
                                       >
                                          В корзину
                                       </button>
                                    )
                                 }
                              </div>
                           ) : (
                              <div className={styles.cartLoaderContainer}>
                                 {
                                    isThisProductCartLoading ? (
                                       <div className={styles.cartLoader}>
                                          <Loader />
                                       </div>
                                    ) : (
                                       <div className={styles.quantityControls}>
                                          <button onClick={(e) => handleClickCart(e, id, 'decrement')}>-</button>
                                          <span className={styles.count}>{inCart.quantity}</span>
                                          <button onClick={(e) => handleClickCart(e, id, 'increment')}>+</button>
                                       </div>
                                    )
                                 }
                              </div>
                           )
                        }
                     </div>
                  </div>
               </div>

               <div className={styles.deliveryInfo}>
                  <span>Ваш город: <b>Москва</b></span>
                  <a href="#delivery">Подробнее о доставке</a>
               </div>

               <div onClick={handleOpenCheaperModal} className={styles.foundCheaper}>
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

                           <div id='tabs-start' className={styles.reviewsList}>
                              {
                                 loadingReview ? (
                                    <div className='preloader'>
                                       <Loader />
                                    </div>
                                 ) : (
                                    <div>
                                       {reviews.map(review => (
                                          <div key={review.review_id} className={styles.reviewItem}>
                                             {/* Здесь верстка одного отзыва */}
                                             <ReviewItem review={review} />
                                          </div>
                                       ))}
                                    </div>
                                 )
                              }
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

         {/* Модальное окно с картинкой */}
         {
            isImageModalOpen && (
               <div className={styles.imageOverlay} onClick={closeImageModal}>
                  <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
                     <button className={styles.closeBtn} onClick={closeImageModal}>
                        <ChevronRight style={{ transform: 'rotate(45deg)' }} size={32} />
                     </button>
                     <img
                        src={product.product_images?.[activeImage]}
                        alt="Full size"
                     />
                  </div>
               </div>
            )
         }

         {/* Модалка "Нашли дешевле" */}
         {isCheaperModalOpen && (
            <div className={styles.imageOverlay} onClick={handleCloseCheaperModal}>
               <div className={styles.cheaperModalContent} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.closeBtn} onClick={handleCloseCheaperModal}>
                     <ChevronRight style={{ transform: 'rotate(45deg)' }} size={24} />
                  </button>

                  <h3 className={styles.cheaperTitle}>Нашли дешевле?</h3>

                  <form onSubmit={handleFormCheaper} className={styles.cheaperForm}>
                     <div className={styles.inputGroup}>
                        <label>Ссылка на товар*</label>
                        <textarea
                           name='link'
                           onChange={(e) => setCheaperFormData({ ...cheaperFormData, [e.target.name]: e.target.value })}
                           placeholder="www.akusherstvo.ru/catalog/..."
                           className={styles.cheaperTextarea}
                        />
                     </div>

                     <div className={styles.inputGroup}>
                        <label>Ваш телефон*</label>
                        <input
                           name='phone'
                           onChange={(e) => setCheaperFormData({ ...cheaperFormData, [e.target.name]: e.target.value })}
                           type="tel"
                           placeholder="+7 (___) ___-__-__"
                           className={styles.cheaperInput}
                        />
                     </div>

                     <p className={styles.cheaperNote}>
                        Мы проверим информацию и свяжемся с Вами
                     </p>

                     {
                        cheaperLoading ? (
                           <div className={styles.cheaperLoader}>
                              <Loader />
                           </div>
                        ) : (
                           <button type="submit" className={styles.cheaperSubmitBtn}>
                              Отправить
                           </button>
                        )
                     }
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProductPage;