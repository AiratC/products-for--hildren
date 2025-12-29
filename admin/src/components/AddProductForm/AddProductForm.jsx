import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, Select, Space, Upload } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../redux/slices/productSlice';

const AddProductForm = ({ filter_config, onSuccess, categoryID }) => {
   // Импортируем TextArea отдельно для удобства, либо используем Input.TextArea
   const { TextArea } = Input;
   const [form] = Form.useForm();

   const dispatch = useDispatch();
   const { loading } = useSelector(state => state.product);

   const onFinish = (values) => {
      // Превращаем массив из Upload в простой массив URL или объектов для базы
      const formattedValues = {
         ...values,
         category_id: categoryID,
         product_images: values.product_images?.map(file => file)
      }
      console.log('Данные для отправки: ', formattedValues );
      // Здесь будет dispatch(createProduct(formattedValues))
      dispatch(createProduct(formattedValues)).then((res) => {
         if(res.meta.requestStatus === 'fulfilled') {
            onSuccess(); // Закрываем модалку только при успехе
         }
      })
   };

   // Функция для предотвращения автоматической отправки файла на сервер сразу (если будем грузить вручеую)
   const normFile = (e) => {
      if (Array.isArray(e)) return e;
      return e?.fileList;
   }

   return (
      <div>
         <Form form={form} layout='vertical' onFinish={onFinish}>
            {/* Стандартные поля для всех товаров */}
            <Form.Item label='Название товара' name={`title`} rules={[{ required: true }]}>
               <Input placeholder='Название товара: например кроватка, детский компьютер и т.д' />
            </Form.Item>

            <Form.Item label='Описание товара' name='description'>
               <TextArea
                  rows={4}
                  placeholder='Введите подробное описание товара (материалы, особенности, комплектация)...'
                  showCount
                  maxLength={2000}
               />
            </Form.Item>

            <Space size={`large`}>
               <Form.Item label='Цена' name={`price`} rules={[{ required: true }]}>
                  <InputNumber placeholder='Цена' min={0} style={{ width: '150px' }}></InputNumber>
               </Form.Item>
               {/* Поле для артикула */}
               <Form.Item label='Артикул' name={`article`} rules={[{ required: true }]}>
                  <Input placeholder='Код товара' style={{ width: '150px' }}></Input>
               </Form.Item>
            </Space>

            {/* Секция изображений */}
            <Divider titlePlacement='left'>Изображения товара</Divider>
            <Form.Item
               label='Загрузить фото (массив)'
               name={`product_images`}
               valuePropName='fileList'
               getValueFromEvent={normFile}
               rules={[{ required: true }]}
            >
               <Upload
                  listType='picture-card'
                  multiple
                  beforeUpload={() => false} // Отключаем авто-загрузку для текста
               >
                  <div>
                     <PlusOutlined />
                     <div style={{ marginTop: 8 }}>Загрузить</div>
                  </div>
               </Upload>
            </Form.Item>

            {/* Динамические поля на основе конфига категорий */}
            {
               filter_config.length > 0 ? (
                  <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
                     <h4>Характеристики категории</h4>
                     {
                        filter_config.map((field) => (
                           <Form.Item
                              rules={[{ required: true }]}
                              key={field.name}
                              label={field.label}
                              // Сохраняем все динамические поля внутрь объекта characteristics
                              name={['characteristics', field.name]}
                           >
                              {
                                 field.type === 'select' || field.type === 'checkbox_group' ? (
                                    <Select placeholder={`Выберите ${field.label.toLowerCase()}`}>
                                       {field.options?.map((option) => (
                                          <Select.Option key={option} value={option}>{option}</Select.Option>
                                       ))}
                                    </Select>
                                 ) : <Input placeholder={`Введите ${field.label.toLowerCase()}`} />
                              }
                           </Form.Item>
                        ))
                     }
                  </div>
               ) : (
                  ''
               )
            }

            <Form.Item>
               <Button type='primary' htmlType='submit' block loading={loading}>
                  Создать товар
               </Button>
            </Form.Item>

         </Form>
      </div>
   )
}

export default AddProductForm
