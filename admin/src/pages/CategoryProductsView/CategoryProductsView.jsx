import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getCategories } from '../../redux/slices/categorySlice';
import { Button, Modal } from 'antd';
import AddProductForm from '../../components/AddProductForm/AddProductForm';

const CategoryProductsView = () => {
   const { id } = useParams();
   const [openAddProductForm, setOpenAddProductForm] = useState(false);
   const currentCategory = useSelector(state => state.category.categories.find(cat => cat.category_id === Number(id)));
   const dispatch = useDispatch();


   useEffect(() => {
      dispatch(getCategories())
   }, [dispatch]);

   const handleSuccess = useCallback(() => {
      setOpenAddProductForm(false)
   }, []);


   return (
      <div>
         <div>
            <h1>Товары категории: {currentCategory?.name}</h1>
            <Button onClick={() => setOpenAddProductForm(true)}>
               Добавить {currentCategory?.name.toLowerCase()}
            </Button>
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
