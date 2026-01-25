import React from 'react'
import momAndBabyImg from './../../assets/webp/mom-and-baby.webp'
import styles from './Hero.module.css'

const Hero = () => {
   return (
         <section className={`${styles.hero}`}>
            <div className={`container ${styles.heroContainer}`}>
               <div className={styles.content}>
                  <h1 className={styles.title}>
                     Все самое необходимое для вашего ребенка
                  </h1>
                  <p className={styles.subTitle}>
                     Посмотрите нашу новую подборку для ухода за вашим ребенком
                  </p>
                  <button className={styles.btn}>Смотреть</button>
               </div>

               <div className={styles.imageWrapper}>
                  <img src={momAndBabyImg} alt="Мама и ребёнок" className={styles.image} />
               </div>
            </div>
         </section>
   )
}

export default Hero
