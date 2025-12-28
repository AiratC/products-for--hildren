import React, { useEffect, useState } from 'react'
import AddCategoryForm from '../../components/AddCategoryForm/AddCategoryForm';
import { fetchAxios } from '../../utils/fetchAxios';
import { Button, message, Modal, Spin } from 'antd';

const CategoryPage = () => {
   const [openFormAddCategory, setOpenFormAddCategory] = useState(false);
   const [catalogs, setCatalogs] = useState([]);
   const [loading, setLoading] = useState(true);

   // Получаем весь каталог и прокидываем его пропсами в <AddCategoryForm />
   useEffect(() => {
      const getCatalog = async () => {
         try {
            const response = await fetchAxios.get('/api/catalog/get-all-catalog');
            setCatalogs(response.data.catalog);
         } catch (error) {
            message.error(error.response.data.message)
         } finally {
            setLoading(false)
         }
      }
      getCatalog()
   }, [])

   if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin style={{ margin: '20px' }} /></div>
   }

   return (
      <>
         <div>
            <h2>Категории</h2>
            <div>
               <Button onClick={() => setOpenFormAddCategory(true)} type='primary' htmlType='submit' style={{ marginTop: 16 }}>
                  Добавить категорию
               </Button>
            </div>
            <div>
               Контайнер для вывода всех категорий
            </div>
            {openFormAddCategory && (
               <Modal
                  title="Добавление новой категории"
                  open={openFormAddCategory}
                  onCancel={() => setOpenFormAddCategory(false)}
                  footer={null} // Чтобы использовать кнопку внутри самой формы
                  width={550}
               >
                  <AddCategoryForm
                     catalogs={catalogs}
                     onSuccess={() => {
                        setOpenFormAddCategory(false); // Закрыть после успеха
                        // Тут можно вызвать функцию обновления списка категорий
                     }}
                  />
               </Modal>
            )}
         </div>
      </>
   )
}

export default CategoryPage
