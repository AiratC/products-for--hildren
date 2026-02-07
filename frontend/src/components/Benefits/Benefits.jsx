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
                              <path fill="#8ECAE6" d="M37.5,-51.2C48.1,-44.1,56,-32.4,61.1,-19.5C66.2,-6.6,68.5,7.6,64.2,19.6C59.9,31.6,49.1,41.4,37.1,49.1C25,56.8,11.7,62.3,-1.4,64.2C-14.5,66.1,-29,64.4,-41.2,56.8C-53.4,49.1,-63.3,35.5,-67,20.5C-70.7,5.5,-68.2,-10.8,-61,-24.5C-53.8,-38.2,-41.8,-49.4,-29.2,-55.4C-16.5,-61.5,-3.2,-62.4,10.6,-59.2C24.4,-56,37.5,-51.2Z" transform="translate(50 50)" />
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
