import React from 'react'
import styles from './Benefits.module.css'

const benefitsData = [
   { id: 1, text: "Все товары для детей в одном месте" },
   { id: 2, text: "Цены ниже, чем у конкурентов" },
   { id: 3, text: "Официальные дилеры лучших мировых производителей" },
   { id: 4, text: "Собственное эко-производство" }
];

const Benefits = () => {
   return (
      <section className={styles.benefitsSection}>
         <div className={`container`}>
            <h2 className={styles.title}>
               Карапуз - это онлайн гипермаркет товаров для детей. С нами вырастают поколения!
            </h2>

            <div className={styles.grid}>
               {
                  benefitsData.map((item) => (
                     <div key={item.id} className={styles.card}>
                        <div className={styles.iconWrapper}>
                           <span className={styles.number}>{item.id}</span>
                           {/* Фигурная подложка в виде кляксы как на макете */}
                           <svg className={styles.blob} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                              <path
                                 fill="#8ECAE6"
                                 d="M78.6,30.3C85.8,44.7,82.8,66.6,70.5,76.5C58.2,86.4,36.5,84.4,22.1,73.6C7.8,62.8,0.7,43.2,7.3,28.4C13.9,13.6,34.2,3.6,53,5.1C71.8,6.5,71.5,15.9,78.6,30.3Z"
                              />
                           </svg>
                        </div>
                        <p className={styles.text}>{item.text}</p>
                     </div>
                  ))
               }
            </div>
         </div>
      </section>
   )
}

export default Benefits
