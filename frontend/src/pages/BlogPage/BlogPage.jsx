import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, setCurrentPage } from '../../redux/slices/blogSlice';
import styles from './BlogPage.module.css';
import { ChevronRight } from 'lucide-react';
import getPaginationRange from '../../utils/paginationRange';
import Loader from '../../components/Loader/Loader';
import { Link } from 'react-router';

const BlogPage = () => {
   const dispatch = useDispatch();
   const { items, totalPages, currentPage, loading } = useSelector(state => state.blogs);
   const range = getPaginationRange(currentPage, totalPages);

   useEffect(() => {
      // Скроллим вверх плавно ПЕРЕД загрузкой или сразу после клика
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(fetchBlogs(currentPage));
   }, [dispatch, currentPage]);

   // Обработчик клика теперь ТУПО меняет номер в сторе
   const handlePageChange = (page) => {
      if (typeof page === 'number' && page !== currentPage) {
         dispatch(setCurrentPage(page));
      }
   };

   return (
      <div className={styles.container} style={{ minHeight: '80vh', position: 'relative' }}>
         <h1 className={styles.title}>Блог</h1>

         {/* Вместо удаления всего контента, показываем лоадер поверх или вместо сетки */}
         {loading ? (
            <div className={styles.blogPageLoader}>
               <Loader />
            </div>
         ) : (
            <>
               <div className={styles.grid}>
                  {items.map((blog) => (
                     <article key={blog.blog_id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                           <img src={blog.blog_images?.[0].url || '/default-blog.jpg'} alt={blog.blog_title} />
                        </div>
                        <div className={styles.content}>
                           <h3 className={styles.cardTitle}>{blog.blog_title}</h3>
                           <p className={styles.description}>{blog.description}</p>
                           <div className={styles.footer}>
                              <Link to={`/blog/${blog.blog_id}`}>
                                 <button className={styles.readBtn}>Читать</button>
                              </Link>
                              <span className={styles.date}>
                                 {new Date(blog.created_at).toLocaleDateString()}
                              </span>
                           </div>
                        </div>
                     </article>
                  ))}
               </div>

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
            </>
         )}
      </div>
   );
};

export default BlogPage;
