-- БАЗА ДАННЫХ ОНЛАЙН ГИПЕРМАРКЕТ ТОВАРОВ ДЛЯ ДЕТЕЙ


CREATE TYPE user_role_type AS ENUM ('Админ', 'Пользователь', 'Гость');

-- Создание таблицы ролей
CREATE TABLE Roles (
   role_id SERIAL PRIMARY KEY,
   name user_role_type NOT NULL UNIQUE
);

-- Вставка базовых ролей ('Админ'), ('Пользователь'), ('Гость')
INSERT INTO Roles (name)
VALUES ('Админ'), ('Пользователь'), ('Гость');

-- Создание таблицы пользователей
CREATE TABLE Users (
   user_id SERIAL PRIMARY KEY,
   role_id INT REFERENCES Roles(role_id) ON DELETE SET DEFAULT NOT NULL DEFAULT 2,
   name VARCHAR(255),
   email VARCHAR(250) UNIQUE NOT NULL,
   password_hash VARCHAR(255) NOT NULL,
   delivery_address VARCHAR(350) DEFAULT NULL,
   phone VARCHAR(30) UNIQUE,
   avatar TEXT DEFAULT NULL,
   reset_password_token VARCHAR(255),
   reset_password_expires TIMESTAMP WITHOUT TIME ZONE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица каталог
CREATE TABLE Catalog (
   catalog_id SERIAL PRIMARY KEY,
   name VARCHAR(150)
);

-- Сразу добавляем в каталог данные
INSERT INTO Catalog (name) 
VALUES 
   ('Акции'), ('Детская мебель'), ('Коляски'), ('Автокресла'), 
   ('Одежда'), ('Кормление'), ('Гигиена и уход'), ('Умные игрушки');

-- Таблица категории
CREATE TABLE Categories (
   category_id SERIAL PRIMARY KEY,
   catalog_id INT REFERENCES Catalog(catalog_id) ON DELETE CASCADE NOT NULL,
   name VARCHAR(400),
   filter_config JSONB DEFAULT '[]'
);

-- Создание таблицы товаров
CREATE TABLE Products (
   product_id SERIAL PRIMARY KEY,
   category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE NOT NULL,
   title VARCHAR(500) NOT NULL,
   -- Артикул товара
   article VARCHAR(100) DEFAULT NULL,
   description TEXT,
   price DECIMAL(10, 2) NOT NULL,
   old_price DECIMAL(10, 2) DEFAULT NULL,
   -- Характеристики
   characteristics JSONB DEFAULT '{}',
   product_images JSONB DEFAULT '[]',
   is_new BOOLEAN DEFAULT FALSE,
   is_popular BOOLEAN DEFAULT FALSE,
   is_on_sale BOOLEAN DEFAULT FALSE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Создание таблицы корзины
CREATE TABLE Cart (
   cart_id SERIAL PRIMARY KEY,
   -- При удалении пользователя удалятся все данные корзины
   user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL
);

-- Создание таблицы для хранения товаров корзины
CREATE TABLE Cart_Items (
   cart_item_id SERIAL PRIMARY KEY,
   -- При удалении корзины все значения буду удалены
   cart_id INT REFERENCES Cart(cart_id) ON DELETE CASCADE NOT NULL,
   product_id INT REFERENCES Products(product_id) ON DELETE CASCADE NOT NULL,
   quantity INT NOT NULL
);

-- Создание таблицы избранное
CREATE TABLE Favorites (
   favorites_id SERIAL PRIMARY KEY,
   user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL
);

-- Создание таблицы для хранения избранных товаров
CREATE TABLE Favorites_Items (
   favorites_item_id SERIAL PRIMARY KEY,
   favorites_id INT REFERENCES Favorites(favorites_id) ON DELETE CASCADE NOT NULL,
   product_id INT REFERENCES Products(product_id) ON DELETE CASCADE NOT NULL
);

-- Создание таблицы Блогов
CREATE TABLE Blogs (
   blog_id SERIAL PRIMARY KEY,
   blog_title VARCHAR(300),
   description TEXT,
   blog_images JSONB,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу акций
CREATE TABLE Stock (
   stok_id SERIAL PRIMARY KEY,
   title VARCHAR(400),
   description TEXT,
   stok_images JSONB,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Создание таблицы контакты
CREATE TABLE Contacts (
   contact_id SERIAL PRIMARY KEY,
   name VARCHAR(300),
   phone VARCHAR(30) UNIQUE,
   message TEXT,
   -- Соглашение на обработку данных и пользовательское соглашение
   is_agree BOOLEAN NOT NULL
);

-- Создание таблицы нашли дешевле - любой пользователь сможет отправить форму если нашел товар дешевле
CREATE TABLE Found_Cheaper (
   id SERIAL PRIMARY KEY,
   product_id INT REFERENCES Products(product_id) ON DELETE CASCADE NOT NULL,
   -- Ссылка на товар
   link TEXT,
   phone VARCHAR(30) UNIQUE
);


-- Создаем таблицу оптовым клиентам
CREATE TABLE Wholesale_Customers (
   id SERIAL PRIMARY KEY,
   name VARCHAR(300) NOT NULL,
   phone VARCHAR(30) NOT NULL,
   email VARCHAR(250) NOT NULL,
   city VARCHAR(300) NOT NULL,
   -- Вставить капчу
   captcha TEXT,
   -- Соглашение на обработку данных и пользовательское соглашение
   is_agree BOOLEAN NOT NULL DEFAULT TRUE
);

-- ====================================================================================
-- ТАБЛИЦА ОТЗЫВОВ
-- ====================================================================================
CREATE TABLE Reviews (
   review_id SERIAL PRIMARY KEY,
   -- При удалении Пользователя, удаляются все его Отзывы.
   user_id INT REFERENCES Users(user_id) ON DELETE CASCADE NOT NULL,
   -- При удалении Продукта, удаляются все связанные Отзывы. (Уже было CASCADE)
   product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
   name VARCHAR(300),
   -- Достоинства
   advantages TEXT,
   -- Недостатки
   flaws TEXT,
   -- Комментарий
   comment TEXT,
   rating INT CHECK (
      rating >= 1
      AND rating <= 5
   ) NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу заказа
CREATE TABLE Orders (
   order_id SERIAL PRIMARY KEY,
   user_id INTEGER REFERENCES Users(user_id) ON DELETE SET NULL,
   payment_method VARCHAR(50) NOT NULL, -- 'card', 'cash_courier', 'paypal, 'cash_on_delivery''
   payment_status VARCHAR(20) DEFAULT 'pending',
   order_status VARCHAR(100) DEFAULT 'new', -- Статус: 'new', 'processing', 'delivered', 'cancelled'
   delivery_method VARCHAR(50) NOT NULL, -- Способ доставки ('tk', 'post', 'self')
   choosing_transport_company VARCHAR(50), -- СДЕК, Деловые линии
   -- Адрес получателя
   recipient_address JSONB NOT NULL,
   total_amount DECIMAL(12, 2) NOT NULL,
   payment_info JSONB DEFAULT '{}', -- Технические детали транзакции
   contact_info JSONB NOT NULL, -- ФИО, телефон и email из формы (чтобы сохранились на момент заказа)
   comment_the_order TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу для храненеия данных заказа
CREATE TABLE Order_Items (
   order_item_id SERIAL PRIMARY KEY,
   order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE NOT NULL,
   product_id INT REFERENCES Products(product_id) ON DELETE RESTRICT NOT NULL,
   quantity INT NOT NULL CHECK (quantity > 0),
   price_at_purchase DECIMAL(10, 2) NOT NULL -- Фиксируем цену на момент покупки!
);