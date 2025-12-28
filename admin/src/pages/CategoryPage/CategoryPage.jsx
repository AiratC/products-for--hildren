import React, { useCallback, useEffect, useState } from 'react'
import AddCategoryForm from '../../components/AddCategoryForm/AddCategoryForm';
import { fetchAxios } from '../../utils/fetchAxios';
import { Button, message, Modal, Spin, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../redux/slices/categorySlice';

const columns = [
   {
      title: 'ID',
      dataIndex: 'category_id',
      key: 'category_id',
      width: 70,
   },
   {
      title: 'Название категории',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <b>{text}</b>,
   },
   {
      title: 'Раздел каталога',
      dataIndex: 'catalog_name',
      key: 'catalog_name',
      render: (text) => <Tag color="blue">{text}</Tag>,
   },
   {
      title: 'Конфигурация (фильтры)',
      dataIndex: 'filter_config',
      key: 'filter_config',
      render: (config) => (
         <span>Характеристик: {config?.length || 0}</span>
      ),
   },
   {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
         <Button type="link" onClick={() => console.log('Редактировать:', record)}>
            Изменить
         </Button>
      ),
   },
];


const CategoryPage = () => {
   const [openFormAddCategory, setOpenFormAddCategory] = useState(false);
   const dispatch = useDispatch();
   const { categories, loading } = useSelector(state => state.category);
   const [catalogs, setCatalogs] = useState([]);
   const [loadingCatalog, setLoadingCatalog] = useState(true);

   // Оборачиваем в useCallback, чтобы AddCategoryForm не рендерился лишний раз
   const handleSuccess = useCallback(() => {
      setOpenFormAddCategory(false);
   }, []);

   // Получаем весь каталог и прокидываем его пропсами в <AddCategoryForm />
   useEffect(() => {
      const getCatalog = async () => {
         try {
            const response = await fetchAxios.get('/api/catalog/get-all-catalog');
            setCatalogs(response.data.catalog);
         } catch (error) {
            message.error(error.response.data.message)
         } finally {
            setLoadingCatalog(false)
         }
      }
      getCatalog()
   }, [])

   useEffect(() => {
      dispatch(getCategories())
   }, [dispatch]);

   if ((loadingCatalog || loading) && categories.length === 0) {
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
               {
                  categories.length > 0 ? (
                     <Table
                        dataSource={categories}
                        columns={columns}
                        rowKey="category_id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                     />
                  ) : (
                     <h2>Нет категорий</h2>
                  )
               }
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
                     onSuccess={handleSuccess}
                  />
               </Modal>
            )}
         </div>
      </>
   )
}

export default CategoryPage
