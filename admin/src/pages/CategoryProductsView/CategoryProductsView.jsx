import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getCategories } from '../../redux/slices/categorySlice';
import { Button, Image, Modal, Spin, Table } from 'antd';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import { fetchProductsByCategory } from '../../redux/slices/productSlice';


const columns = [
   {
      title: 'Фото',
      dataIndex: 'product_images',
      key: 'image',
      render: (images) => (
         <Image
            src={images && images[0]}
            width={50}
            fallback="https://via.placeholder.com/50"
         />
      ),
   },
   { title: 'Название', dataIndex: 'title', key: 'title' },
   { title: 'Артикул', dataIndex: 'article', key: 'article' },
   { title: 'Цена', dataIndex: 'price', key: 'price', render: (p) => `${p} ₽` },
];

const CategoryProductsView = () => {
   const { id } = useParams();
   const [openAddProductForm, setOpenAddProductForm] = useState(false);
   const { products, loading } = useSelector(state => state.product);
   const currentCategory = useSelector(state => state.category.categories.find(cat => cat.category_id === Number(id)));
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(fetchProductsByCategory(id))
   }, [dispatch, id])

   useEffect(() => {
      dispatch(getCategories())
   }, [dispatch]);

   const handleSuccess = useCallback(() => {
      setOpenAddProductForm(false);
      dispatch(fetchProductsByCategory(id));
   }, [dispatch, id]);

   if (loading) {
      return <div style={{ textAlign: 'center' }}><Spin style={{ margin: '20px' }} /></div>
   }

   return (
      <div>
         <div>
            <h1>Товары категории: {currentCategory?.name}</h1>
            <Button onClick={() => setOpenAddProductForm(true)}>
               Добавить {currentCategory?.name.toLowerCase()}
            </Button>
         </div>
         <div style={{ marginTop: '20px' }}>
            <Table
               dataSource={products}
               columns={columns}
               rowKey="product_id"
               loading={loading}
               locale={{ emptyText: 'Нет товаров данной категории' }}
            />
         </div>
         {
            openAddProductForm && (
               <Modal
                  title="Добавление нового товара"
                  open={openAddProductForm}
                  onCancel={() => setOpenAddProductForm(false)}
                  footer={null} // Чтобы использовать кнопку внутри самой формы
                  width={550}
               >
                  <AddProductForm categoryID={id} filter_config={currentCategory?.filter_config} onSuccess={handleSuccess} />
               </Modal>
            )
         }
      </div>
   )
}

export default CategoryProductsView
