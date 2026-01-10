import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Upload } from 'antd';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addStock } from '../../redux/slices/stockSlice';

const StockPage = () => {
   // Состояние для открытия и закрытия формы
   const [isModalVisible, setIsModalVisible] = useState(false);
   const dispatch = useDispatch();
   const [form] = Form.useForm();

   const onFinish = (values) => {
      // Создаем объект FormData
      const formData = new FormData();

      // Добавляем текстовые поля
      formData.append('title', values.title);
      formData.append('description', values.description);

      // Добавляем файл
      // В Ant Design данные лежат в values.image.fileList
      if(values.image && values.image.fileList.length > 0) {
         const file = values.image.fileList[0].originFileObj;
         formData.append('stock_image', file); // Ключ должен совпадать с тем что ждет multer на бэкенде
      }

      // Отправляем данные в Redux Thunk
      dispatch(addStock(formData));
      setIsModalVisible(false);
      form.resetFields();
   };


   return (
      <div style={{ padding: '20px' }}>
         <Button
            type='primary'
            icon={<PlusOutlined/>}
            onClick={() => setIsModalVisible(true)}
         >
            Добавить акцию
         </Button>

         <Modal
            title='Новая акция'
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={() => form.submit()}
         >
            <Form form={form} layout='vertical' onFinish={onFinish}>
               <Form.Item
                  name={`title`}
                  label='Заголовок'
                  rules={[{ required: true, message: 'Введите заголовок' }]}
               >
                  <Input placeholder='Например: Вкусные скдидки до -25% на все детское питание'/>
               </Form.Item>

               <Form.Item name={`description`} label='Описание'>
                  <Input.TextArea rows={4} placeholder='Детали акции...'/>
               </Form.Item>

               <Form.Item
                  name={`image`}
                  label='Изображение акции'
                  rules={[{ required: true, message: 'Загрузите фото' }]}
               >
                  <Upload
                     listType='picture'
                     maxCount={1}
                     beforeUpload={() => false} // Останавливает автоматическую отправку
                  >
                     <Button icon={<UploadOutlined/>}>Выбрать файл</Button>
                  </Upload>
               </Form.Item>
            </Form>
         </Modal>
      </div>
   )
}

export default StockPage
