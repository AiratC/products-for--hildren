import { query } from "../config/db.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

// ! Вход в админку
export const loginAdmin = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({
         message: 'Заполните все поля ввода',
         error: true,
         success: false
      })
   };

   try {
      // Находим пользователя по email
      const findUserByEmail = await query(`SELECT * FROM Users WHERE email = $1`, [email]);

      // Если пользователь не найден то ошибка
      if (findUserByEmail.rows.length === 0) {
         return res.status(404).json({
            message: "Неверный email или пароль",
            error: true,
            success: false
         })
      };

      // Проверка на админа
      if(findUserByEmail.rows[0].role_id !== 1) {
         return res.status(403).json({
            message: "Неверный email или пароль",
            error: true,
            success: false
         })
      }

      // Если пользователь найден то сравниваем пароль и создаем токен
      const comparePassword = await bcrypt.compare(password, findUserByEmail.rows[0].password_hash);

      if (!comparePassword) {
         return res.status(400).json({
            message: "Неверный email или пароль",
            error: true,
            success: false
         })
      };

      const token = await jwt.sign(
         { userId: findUserByEmail.rows[0].user_id, roleId: findUserByEmail.rows[0].role_id },
         process.env.JWT_SECRET,
         { expiresIn: '7d' }
      );

      res.cookie("token", token, {
         httpOnly: true, // Запрещает доступ к куки через клиентский JavaScript
         secure: true, // обязательно для https
         sameSite: "none", // разрешает кросс-доменные куки
      });

      const { password_hash, ...data } = findUserByEmail.rows[0]

      return res.status(200).json({
         message: "Вход выполнен",
         error: false,
         success: true,
         user: data
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при входе в админку на сервере',
         error: true,
         success: false
      });
   }
};

// ! Выход
export const logoutAdmin = async (req, res) => {
   try {
      res.clearCookie("token", {
         httpOnly: true,
         secure: true,
         sameSite: "none",
      });

      return res.status(200).json({
         message: "Выход из системы успешен",
         success: true,
         error: false,
         user: null,
      });
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при выходе из админки на сервере',
         error: true,
         success: false
      });
   }
}

// ! Контроллер getMe
export const getMe = async (req, res) => {
   try {
      const result = await query(`SELECT user_id, name, email, role_id FROM Users WHERE user_id = $1`, [req.user.userId]);

      if(result.rows.length === 0) {
         return res.status(404).json({
            message: "Пользователь не найден",
            error: true,
            success: false
         })
      }

      return res.status(200).json({
         message: 'Вы админ',
         success: true,
         error: false,
         user: result.rows[0]
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при проверки сессии на сервере',
         error: true,
         success: false
      });
   }
}