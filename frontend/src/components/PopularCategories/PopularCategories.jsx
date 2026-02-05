import React from 'react'
import styles from './PopularCategories.module.css'
import populaCribsImg from './../../assets/webp/popula-cribs.webp'
import populaStollersImg from './../../assets/webp/popula-strollers.webp'
import { Link } from 'react-router-dom';

const categories = [
   {
      id: 1,
      title: 'Кроватки',
      descr: 'Baby Expert, Baby Italia и др.',
      img: populaCribsImg,
      color: '#F2D9D7',
      link: 'cribs'
   },
   {
      id: 2,
      title: 'Коляски',
      descr: 'Cybex, mima, moon, Hartan и др.',
      img: populaStollersImg,
      color: '#FAF3E7',
      link: 'baby-stroller'
   }
];

const PopularCategories = () => {

   return (
      <section className={styles.section}>
         <div className={`container`}>
            <h2 className={styles.title}>Популярные категории</h2>

            <div className={styles.grid}>
               {
                  categories.map((cat) => (
                     <div
                        key={cat.id}
                        className={styles.card}
                        style={{ backgroundColor: cat.color }}
                     >
                        <div className={styles.info}>
                           <h3 className={styles.catName}>{cat.title}</h3>
                           <p className={styles.catDescr}>{cat.descr}</p>
                           <Link className={styles.btn} to={`/categories/filter/${cat.link}`}>Смотреть</Link>
                        </div>
                        <div className={styles.imageWrapper}>
                           <img className={styles.image} src={cat.img} alt={cat.title} />
                        </div>
                     </div>
                  ))
               }
            </div>
         </div>
      </section>
   )
}

export default PopularCategories
