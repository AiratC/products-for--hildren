import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, Select, Space, Upload } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../../redux/slices/productSlice';
import { useEffect } from 'react';
import { useState } from 'react';

const AddProductForm = ({ filter_config, onSuccess, categoryID, initialValues }) => {
   const { TextArea } = Input;
   const [form] = Form.useForm();
   const [fileList, setFileList] = useState([]);
   const dispatch = useDispatch();
   const { loading } = useSelector(state => state.product);

   console.log(`render AddProductForm`)

   useEffect(() => {
      // 1. Сбрасываем форму и файлы при каждом изменении initialValues (включая открытие пустой формы)
      form.resetFields();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFileList([]);

      if (initialValues) {
         // 2. Парсим характеристики
         const characteristics = typeof initialValues.characteristics === 'string'
            ? JSON.parse(initialValues.characteristics)
            : initialValues.characteristics;

         // 3. Формируем список файлов со СТАТИЧНЫМИ uid
         // Не используем Date.now() внутри map, так как при двойном рендере ключи изменятся!
         const formattedImages = (initialValues.product_images || []).map((url, index) => ({
            uid: `existing-img-${index}`, // Статичный ID на основе индекса
            name: `image-${index}`,
            status: 'done',
            url: url,
         }));

         setFileList(formattedImages);

         // 4. Заполняем поля формы
         form.setFieldsValue({
            ...initialValues,
            characteristics: characteristics,
            product_images: formattedImages // Передаем и в форму для валидации
         });
      }
   }, [initialValues, form]);

   const onFinish = (values) => {
      // Подготавливаем данные: передаем и файлы из fileList, и остальные поля
      const productData = {
         ...values,
         product_images: fileList,
         category_id: categoryID
      };

      if (initialValues) {
         dispatch(updateProduct({ id: initialValues.product_id, productData }))
            .then((res) => {
               if (res.meta.requestStatus === 'fulfilled') onSuccess();
            });
      } else {
         dispatch(createProduct(productData)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') onSuccess();
         });
      }
   };

   // Синхронизация внутреннего стейта Upload с Ant Design Form
   const handleUploadChange = ({ fileList: newFileList }) => {
      setFileList(newFileList);
   };

   const normFile = (e) => {
      if (Array.isArray(e)) return e;
      return e?.fileList;
   };

   return (
      <div>
         <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item label='Название товара' name='title' rules={[{ required: true }]}>
               <Input placeholder='Название товара...' />
            </Form.Item>

            <Form.Item label='Описание товара' name='description'>
               <TextArea rows={4} showCount maxLength={2000} />
            </Form.Item>

            <Space size='large'>
               <Form.Item label='Цена' name='price' rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '150px' }} />
               </Form.Item>
               <Form.Item label='Артикул' name='article' rules={[{ required: true }]}>
                  <Input style={{ width: '150px' }} />
               </Form.Item>
            </Space>

            <Divider titlePlacement='left'>Изображения товара</Divider>
            <Form.Item
               label='Загрузить фото'
               name='product_images'
               valuePropName='fileList'
               getValueFromEvent={normFile}
            >
               <Upload
                  listType='picture-card'
                  multiple
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
               >
                  {fileList.length >= 8 ? null : (
                     <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Загрузить</div>
                     </div>
                  )}
               </Upload>
            </Form.Item>

            {filter_config.length > 0 && (
               <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4>Характеристики категории</h4>
                  {filter_config.map((field, index) => (
                     <Form.Item
                        key={field.name || `field-name-${index}`}
                        label={field.label}
                        name={['characteristics', field.name]}
                        rules={[{ required: true }]}
                     >
                        {field.type === 'select' ? (
                           <Select placeholder={`Выберите ${field.label.toLowerCase()}`}>
                              {field.options?.map((option) => (
                                 <Select.Option key={option} value={option}>{option}</Select.Option>
                              ))}
                           </Select>
                        ) : <Input placeholder={`Введите ${field.label.toLowerCase()}`} />}
                     </Form.Item>
                  ))}
               </div>
            )}

            <Form.Item>
               <Button type='primary' htmlType='submit' block loading={loading}>
                  {initialValues ? 'Сохранить изменения' : 'Создать товар'}
               </Button>
            </Form.Item>
         </Form>
      </div>
   );
};

export default AddProductForm