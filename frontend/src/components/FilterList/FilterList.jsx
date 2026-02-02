import React from 'react';
import { Checkbox, Radio, Select, InputNumber } from 'antd';
import styles from './FilterList.module.css';

const { Option } = Select;

const FilterList = ({ config = [], selectedFilters = {}, onFilterChange }) => {
   return (
      <div className={styles.filterWrapper}>
         {/* Статический блок цены всегда сверху */}
         <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Цена, ₽</h4>
            <div className={styles.priceInputs}>
               <InputNumber
                  placeholder="от 8000"
                  value={selectedFilters.minPrice}
                  onChange={(val) => onFilterChange('minPrice', val)}
                  className={styles.priceInput}
               />
               <InputNumber
                  placeholder="до 999900"
                  value={selectedFilters.maxPrice}
                  onChange={(val) => onFilterChange('maxPrice', val)}
                  className={styles.priceInput}
               />
            </div>
         </div>

         {/* Динамические фильтры из твоего массива */}
         {config.map((filter) => (
            <div key={filter.name} className={styles.filterGroup}>
               <h4 className={styles.filterTitle}>{filter.label}</h4>

               <div className={filter.options.length > 6 ? styles.scrollableArea : ''}>
                  {/* Группа чекбоксов (Бренд, Цвет, Тип) */}
                  {filter.type === 'checkbox_group' && (
                     <div className={styles.checkboxList}>
                        {filter.options.map((option, index) => (
                           <Checkbox
                              key={`${filter.name}-${option}-${index}`}
                              checked={selectedFilters[filter.name]?.includes(option)}
                              onChange={(e) => onFilterChange(filter.name, option, e.target.checked)}
                              className={styles.filterItem}
                           >
                              {option || 'Не указано'}
                           </Checkbox>
                        ))}
                     </div>
                  )}

                  {/* Радио-кнопки (Сроки доставки) */}
                  {filter.type === 'radio_group' && (
                     <Radio.Group
                        value={selectedFilters[filter.name]}
                        onChange={(e) => onFilterChange(filter.name, e.target.value)}
                        className={styles.radioList}
                     >
                        {filter.options.map((option, index) => (
                           <Radio key={`${filter.name}-${option}-${index}`} value={option} className={styles.filterItem}>
                              {option}
                           </Radio>
                        ))}
                     </Radio.Group>
                  )}

                  {/* Выпадающий список (Материал) */}
                  {filter.type === 'select' && (
                     <Select
                        placeholder="Выберите материал"
                        style={{ width: '100%' }}
                        value={selectedFilters[filter.name]}
                        onChange={(val) => onFilterChange(filter.name, val)}
                     >
                        {filter.options.map((option, index) => (
                           <Option key={`${filter.name}-${option}-${index}`} value={option}>{option}</Option>
                        ))}
                     </Select>
                  )}
               </div>
            </div>
         ))}
      </div>
   );
};

export default FilterList;