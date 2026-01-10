import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Form, Input, message, Modal, Popconfirm, Row, Spin, Tag, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addStock, deleteStock, getAllStocks } from '../../redux/slices/stockSlice';
import styles from './StockPage.module.css';

const { Meta } = Card;

const StockPage = () => {
   const { stocks, loading } = useSelector(state => state.stock);
   // Состояние для открытия и закрытия формы
   const [isModalVisible, setIsModalVisible] = useState(false);
   const dispatch = useDispatch();
   const [form] = Form.useForm();

   useEffect(() => {
      dispatch(getAllStocks())
   }, [dispatch]);

   const handleDeleteStock = (id) => {
      dispatch(deleteStock(id));
   }

   const onFinish = (values) => {
      // Создаем объект FormData
      const formData = new FormData();

      // Добавляем текстовые поля
      formData.append('title', values.title);
      formData.append('description', values.description);

      // Добавляем файл
      // В Ant Design данные лежат в values.image.fileList
      if (values.image && values.image.fileList.length > 0) {
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
            style={{ marginBottom: '30px' }}
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
         >
            Добавить акцию
         </Button>

         {
            loading && stocks.length === 0 ? (
               <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size='large' /></div>
            ) : (
               <Row gutter={[24, 24]}>
                  {
                     stocks.length > 0 ? (
                        stocks.map((stockItem) => (
                           <Col xs={24} sm={12} md={8} lg={6} key={stockItem.stock_id}>
                              <Card
                                 hoverable
                                 cover={
                                    <img
                                       alt={stockItem.title}
                                       src={stockItem.stock_images[0]?.url}
                                       style={{ height: '180px', objectFit: 'cover' }}
                                    />
                                 }
                                 actions={[
                                    <EditOutlined key={`edit`} onClick={() => alert('Редактирование в разработке')} />,
                                    <Popconfirm
                                       title='Удалить акцию?'
                                       description='Изображение также будет удалено из облака'
                                       onConfirm={() => handleDeleteStock(stockItem.stock_id)}
                                       okText='Да'
                                       cancelText='Нет'
                                    >
                                       <DeleteOutlined key={'delete'} style={{ color: 'red' }} />
                                    </Popconfirm>,
                                 ]}
                              >
                                 <Meta
                                    title={<div className={styles.cardTitle}>{stockItem.title}</div>}
                                    description={
                                       <div className={styles.descriptionText}>
                                          {stockItem.description}
                                       </div>
                                    }
                                 />
                                 <div style={{ marginTop: '10px' }}>
                                    <Tag color={`blue`}>Создано: {new Date(stockItem.created_at).toLocaleDateString()}</Tag>
                                 </div>
                              </Card>
                           </Col>
                        ))
                     ) : (
                        <Col span={24}>
                           <Empty description='Акций пока нет' />
                        </Col>
                     )
                  }
               </Row>
            )
         }

         <Modal
            title='Новая акция'
            open={isModalVisible}
            onCancel={() => {
               setIsModalVisible(false);
               form.resetFields();
            }}
            onOk={() => form.submit()}
            confirmLoading={loading}
         >
            <Form form={form} layout='vertical' onFinish={onFinish}>
               <Form.Item
                  name={`title`}
                  label='Заголовок'
                  rules={[{ required: true, message: 'Введите заголовок' }]}
               >
                  <Input placeholder='Например: Вкусные скдидки до -25% на все детское питание' />
               </Form.Item>

               <Form.Item name={`description`} label='Описание'>
                  <Input.TextArea rows={4} placeholder='Детали акции...' />
               </Form.Item>

               <Form.Item
                  name={`image`}
                  label='Изображение акции'
                  rules={[{ required: true, message: 'Загрузите фото' }]}
               >
                  <Upload
                     listType='picture'
                     maxCount={1}
                     accept={'image/*'}
                     beforeUpload={(file) => {
                        const isImage = file.type.startsWith('image/');
                        if(!isImage) {
                           message.error('Можно загружать только изображения');
                        }
                        return isImage || Upload.LIST_IGNORE;
                     }} // Останавливает автоматическую отправку
                  >
                     <Button icon={<UploadOutlined />}>Выбрать файл</Button>
                  </Upload>
               </Form.Item>
            </Form>
         </Modal>
      </div>
   )
}

export default StockPage
