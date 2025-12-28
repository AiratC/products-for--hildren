import React from 'react'
import { Form, Input, Button, Select, Space, Card, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux';
import { createCategory } from '../../redux/slices/categorySlice';
const AddCategoryForm = ({ catalogs, onSuccess }) => {
   const dispatch = useDispatch();
   const [form] = Form.useForm();

   const onFinish = async (values) => {
      // Глубокое копирование, чтобы не менять стейт формы напрямую
      const formattedValues = {
         ...values,
         filter_config: values.filter_config.map(filter => ({
            ...filter,
            // Если есть опции, превращаем строку "А, Б, В" в массив ["А", "Б", "В"]
            options: typeof filter.options === 'string'
               ? filter.options.split(',').map(opt => opt.trim())
               : filter.options
         })) || []
      };
      
      console.log('Данные для отправки: ', formattedValues);
      
      try {
         const result = await dispatch(createCategory(formattedValues)).unwrap();
         if(result.success) {
            message.success(result.message);
            form.resetFields(); // Очищаем форму
            
            if(onSuccess) onSuccess();
         };

      } catch (error) {
         console.log(error);
         message.error(error || 'Ошибка при добавлении категории')
      }
   }

   return (
      <div>
         <Form form={form} layout='vertical' onFinish={onFinish}>
            <Card title='Основная информация'>
               <Form.Item name='name' label='Название категории' rules={[{ required: true }]} >
                  <Input placeholder='Например: Кроватки' />
               </Form.Item>

               <Form.Item name={`catalog_id`} label='Раздел каталога' rules={[{ required: true }]}>
                  <Select placeholder='Выберите раздел'>
                     {
                        catalogs.map(cat => (
                           <Select.Option key={cat.catalog_id} value={cat.catalog_id}>
                              {cat.name}
                           </Select.Option>
                        ))
                     }
                  </Select>
               </Form.Item>
            </Card>

            <Card title='Конфигурация фильтров (характеристик)' style={{ marginTop: 16 }}>
               <Form.List name={`filter_config`}>
                  {
                     (fields, { add, remove }) => (
                        <>
                           {
                              fields?.map(({ key, name, ...restField }) => (
                                 <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                                    {/* Техническое имя поля для JSON (например, 'material') */}
                                    <Form.Item
                                       {...restField}
                                       name={[name, 'name']}
                                       rules={[{ required: true, message: 'Укажите ключ' }]}
                                    >
                                       <Input placeholder='Ключ (brand) (size)' />
                                    </Form.Item>

                                    {/* Отображаемое имя для пользователя (например, 'Материал' 'Размер') */}
                                    <Form.Item
                                       {...restField}
                                       name={[name, 'label']}
                                       rules={[{ required: true, message: 'Укажите название' }]}
                                    >
                                       <Input placeholder='Название (Бренд)' />
                                    </Form.Item>

                                    {/* Тип для фильтров */}
                                    <Form.Item
                                       {...restField}
                                       name={[name, 'type']}
                                       rules={[{ required: true, message: 'Выберите тип' }]}
                                    >
                                       <Select placeholder='Тип поля' style={{ width: 120 }}>
                                          <Select.Option value='select'>Список</Select.Option>
                                          <Select.Option value='checkbox_group'>Группа галочек</Select.Option>
                                          <Select.Option value='radio_group'>Группа radio кнопок</Select.Option>
                                          <Select.Option value='input'>Текст</Select.Option>
                                       </Select>
                                    </Form.Item>

                                    {/* Опции */}
                                    <Form.Item
                                       noStyle
                                       shouldUpdate={
                                          (prevValues, currentValues) =>
                                             prevValues.filter_config !== currentValues.filter_config
                                       }
                                    >
                                       {({ getFieldValue }) => {
                                          // Проверям какой тип выбран для текущего поля
                                          const filedType = getFieldValue(['filter_config', name, 'type']);
                                          const needsOptions = ['select', 'checkbox_group', 'radio_group'].includes(filedType);

                                          return needsOptions ? (
                                             <Form.Item
                                                {...restField}
                                                name={[name, 'options']}
                                                rules={[{ required: true, message: 'Введите вариант через запятую' }]}
                                             >
                                                <Input placeholder='Опции: Белый, Чёрный, Серый' style={{ width: 250 }} />
                                             </Form.Item>
                                          ) : null;
                                       }}
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                 </Space>
                              ))
                           }
                           <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                              Добавить фильтр
                           </Button>
                        </>
                     )
                  }
               </Form.List>
            </Card>

            <Button type='primary' htmlType='submit' style={{ marginTop: 16 }}>
               Создать категорию
            </Button>
         </Form>
      </div>
   )
}

export default AddCategoryForm;
