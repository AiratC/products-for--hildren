import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogDetails.module.css';
import Loader from '../../components/Loader/Loader';
import { ChevronLeft } from 'lucide-react';
import fetchAxios from '../../utils/fetchAxios';

const BlogDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [blog, setBlog] = useState(null);
   const [loading, setLoading] = useState(true);
   console.log(blog)

   useEffect(() => {
      const fetchFullBlog = async () => {
         try {
            setLoading(true);
            const { data } = await fetchAxios.get(`/api/blogs/get-blog-by-id/${id}`);
            setBlog(data.blog);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      window.scrollTo(0, 0);
      fetchFullBlog();
   }, [id]);

   if (loading) return <div className={styles.center}><Loader /></div>;
   if (!blog) return <div className={styles.center}>Статья не найдена</div>;

   return (
      <div className={styles.container}>
         <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ChevronLeft size={20} /> Назад
         </button>

         {/* Изображение */}
         <div className={styles.mainImage}>
            <img src={blog.blog_images?.[0]?.url || '/default-blog.jpg'} alt={blog.blog_title} />
         </div>
         
         <header className={styles.header}>
            <h1 className={styles.title}>{blog.blog_title}</h1>
            <span className={styles.date}>
               {new Date(blog.created_at).toLocaleDateString()}
            </span>
         </header>

         <div className={styles.content}>
            {/* Если текст с тегами HTML, используем dangerouslySetInnerHTML */}
            <div>
               {blog.description }
            </div>
         </div>
      </div>
   );
};

export default BlogDetails;