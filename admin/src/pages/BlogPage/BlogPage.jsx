import { DeleteOutlined, EditOutlined, PlusOutlined, ReadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Form, Input, Modal, Pagination, Popconfirm, Row, Spin, Tag, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './BlogPage.module.css';
import { addBlog, deleteBlog, getAllBlogs } from '../../redux/slices/blogSlice';

const { Meta } = Card;

const BlogPage = () => {
   const { blogs, total, loading } = useSelector(state => state.blog);
   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 12;
   // Состояние для открытия и закрытия формы
   const [isModalVisible, setIsModalVisible] = useState(false);
   const dispatch = useDispatch();
   const [form] = Form.useForm();

   useEffect(() => {
      dispatch(getAllBlogs({ page: currentPage, limit: pageSize }))
   }, [dispatch, currentPage]);

   const handlePageChange = (page) => {
      setCurrentPage(page);
      // Скролл вверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' })
   }

   const handleDeleteBlog = async (id) => {
      await dispatch(deleteBlog(id));

      // Если это была последняя статья на странице и мы не на первой странице
      if(blogs.length === 1 && currentPage > 1) {
         setCurrentPage(currentPage - 1);
      } else {
         dispatch(getAllBlogs({ page: currentPage, limit: pageSize }))
      }
   }

   const onFinish = (values) => {
      // Создаем объект FormData
      const formData = new FormData();

      // Добавляем текстовые поля
      formData.append('blog_title', values.blog_title);
      formData.append('description', values.description);

      // Добавляем файл
      // В Ant Design данные лежат в values.image.fileList
      if (values.image && values.image.length > 0) {
         const file = values.image[0].originFileObj;
         formData.append('blog_image', file); // Ключ должен совпадать с тем что ждет multer на бэкенде
      }

      // Отправляем данные в Redux Thunk
      dispatch(addBlog(formData));
      setIsModalVisible(false);
      form.resetFields();
   };


   return (
      <div style={{ padding: '20px' }}>
         <div>
            <h2>Управление блогом</h2>
            <Button
               style={{ marginBottom: '30px' }}
               type='primary'
               icon={<PlusOutlined />}
               onClick={() => setIsModalVisible(true)}
            >
               Написать статьтю
            </Button>
         </div>


         {
            loading && blogs.length === 0 ? (
               <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size='large' /></div>
            ) : (
               <Row gutter={[24, 24]}>
                  {
                     blogs.length > 0 ? (
                        blogs.map((blog) => (
                           <Col xs={24} sm={12} md={8} lg={6} key={blog.blog_id}>
                              <Card
                                 hoverable
                                 cover={
                                    <img
                                       alt={blog.blog_title}
                                       src={blog.blog_images[0]?.url}
                                       style={{ height: '180px', objectFit: 'cover' }}
                                    />
                                 }
                                 actions={[
                                    <EditOutlined key={`edit`} onClick={() => alert('Редактирование в разработке')} />,
                                    <Popconfirm
                                       title='Удалить статью?'
                                       description='Изображение также будет удалено из облака'
                                       onConfirm={() => handleDeleteBlog(blog.blog_id)}
                                       okText='Да'
                                       cancelText='Нет'
                                    >
                                       <DeleteOutlined key={'delete'} style={{ color: 'red' }} />
                                    </Popconfirm>,
                                 ]}
                              >
                                 <Meta
                                    title={<div className={styles.cardTitle}>{blog.blog_title}</div>}
                                    description={
                                       <div className={styles.descriptionText}>
                                          {blog.description}
                                       </div>
                                    }
                                 />
                                 <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Tag icon={<ReadOutlined />} color={`cyan`}>Статья</Tag>
                                    <small style={{ color: '#999' }}>
                                       {new Date(blog.created_at).toLocaleDateString()}
                                    </small>
                                 </div>
                              </Card>
                           </Col>
                        ))
                     ) : (
                        <Col span={24}>
                           <Empty description='Статей пока нет' />
                        </Col>
                     )
                  }
               </Row>
            )
         }

         {
            total > pageSize && (
               <div style={{ marginTop: '40px', textAlign: 'center' }}>
                  <Pagination
                     current={currentPage}
                     total={total}
                     pageSize={pageSize}
                     onChange={handlePageChange}
                     showSizeChanger={false}
                  />
               </div>
            )
         }

         <Modal
            title='Добавить новую статью в блог'
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
                  name={`blog_title`}
                  label='Заголовок статьи'
                  rules={[{ required: true, message: 'Введите заголовок' }]}
               >
                  <Input placeholder='Например: 10 советов по выбору коляски' />
               </Form.Item>

               <Form.Item
                  name={`description`}
                  label='Текст статьи'
                  rules={[{ required: true, message: 'Введите содержание' }]}
               >
                  <Input.TextArea rows={6} placeholder='Начните писать здесь...' />
               </Form.Item>

               <Form.Item
                  name={`image`}
                  label='Обложка блога'
                  valuePropName='fileList'
                  getValueFromEvent={(e) => {
                     if(Array.isArray(e)) return e;
                     return e?.fileList;
                  }}
                  rules={[{ required: true, message: 'Загрузите обложку' }]}
               >
                  <Upload
                     listType='picture'
                     maxCount={1}
                     accept={'image/*'}
                     beforeUpload={() => false}
                  >
                     <Button icon={<UploadOutlined />}>Выбрать файл</Button>
                  </Upload>
               </Form.Item>
            </Form>
         </Modal>
      </div>
   )
}

export default BlogPage
