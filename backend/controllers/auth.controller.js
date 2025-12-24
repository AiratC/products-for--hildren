import { query } from "../config/db.js";
import bcrypt from 'bcrypt'

// ! Регистрация пользователя
export const registerUser = async (req, res) => {
   const { name, email, password, repeatPassword } = req.body;

   try {
      if (!name || !email || !password || !repeatPassword) {
         return res.status(400).json({
            message: 'Заполните все поля ввода',
            error: true,
            success: false
         })
      }

      if (password !== repeatPassword) {
         return res.status(400).json({
            message: 'Пароли не равны, проверьте ввод',
            error: true,
            success: false
         })
      }

      // Проверка пароля на надёжность
      const specialChars = /[~!@#$%^&*()/ \\]/g;
      const countSymbol = (password.match(specialChars) || []).length;

      if (password.length < 12 || countSymbol < 4) {
         return res.status(400).json({
            message: 'Пароль должен быть от 12 символов и содержать минимум 4 спецсимвола',
            error: true,
            success: false
         });
      }

      // Проверяем что в БД нет пользователя с email
      const findUser = await query(`SELECT * FROM Users WHERE email = $1`, [email]);

      if (findUser.rows.length > 0) {
         return res.status(409).json({
            message: `Пользователь с email: ${email} уже есть в БД`,
            error: true,
            success: false
         })
      };

      // Логика первой регистрации (Админ)
      const countUser = await query(`SELECT COUNT(*) FROM USERS`)
      let roleId = parseInt(countUser.rows[0].count) === 0 ? 1 : 2;

      // Хешируем пароль с bcrypt
      const hashPassword = await bcrypt.hash(password, 10);

      // Добавляем пользователя в БД
      let sqlAddUser = `
   INSERT INTO Users (role_id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *
   `;
      const addUser = await query(sqlAddUser, [roleId, name, email, hashPassword]);
      const {password_hash, ...data} = addUser.rows[0];

      return res.status(201).json({
         message: 'Успешная регистрация',
         error: false,
         success: true,
         user: data
      });

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при регистрации пользователя на сервере',
         error: true,
         success: false
      });
   };

};