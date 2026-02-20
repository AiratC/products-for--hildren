import { query } from "../config/db.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from "cloudinary";

export const getMe = async (req, res) => {
   try {
      const userResult = await query(
         `SELECT * FROM Users WHERE user_id = $1`,
         [req.userId]
      );

      if (userResult.rows.length === 0) {
         return res.status(404).json({
            message: 'Пользователь не найден',
            error: true,
            success: false
         });
      };

      const { password_hash, ...data } = userResult.rows[0]

      return res.status(200).json({
         success: true,
         error: false,
         user: data
      })
   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при проверке сессии на сервере',
         error: true,
         success: false
      })
   }
};

// Обновляем данные пользователя
export const updateUserData = async (req, res) => {
   const {
      name,
      phone,
      delivery_address,
      oldPassword,
      newPassword,
   } = req.body

   const userId = req.userId;

   // Получаем аватар
   const file = req.file;

   try {
      // Проверяем что пользователь не отправляет пустое поле имени
      if (!name.trim()) {
         return res.status(400).json({
            message: 'Введите имя'
         })
      };

      // Проверка пароля на надёжность
      // Проверка пароля на надёжность — ТОЛЬКО если он пришел
      if (newPassword) { // Добавь это условие
         const specialChars = /[~!@#$%^&*()/ \\]/g;
         const countSymbol = (newPassword.match(specialChars) || []).length;

         if (newPassword.length < 12 || countSymbol < 4) {
            return res.status(400).json({
               message: 'Пароль должен быть от 12 символов и содержать минимум 4 спецсимвола',
               error: true,
               success: false
            });
         }
      }

      // !!! Поле телефона не проверяем так как пользователь может не добавлять телефон
      // !!! Адрес доставки тоже не проверяем так как пользователь может не добавлять

      // Находим пользователя по ID
      let { rows } = await query(`SELECT * FROM users WHERE user_id = $1`, [userId]);
      const user = rows[0]

      if (!user) {
         return res.status(404).json({
            message: 'Пользователь не найден'
         })
      };

      // Получаем password_hash
      let passwordHash = user.password_hash;
      let avatarUrl = user.avatar;

      // Логика смены пароля
      if (newPassword && newPassword.trim()) {
         const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
         if (!isMatch) {
            return res.status(400).json({
               message: 'Вы ввели неверно старый пароль'
            });
         };
         passwordHash = await bcrypt.hash(newPassword, 10);
      };

      // Логика аватара
      if (file) {
         // Если у пользователя уже был аватар, удаляем его из Cloudinary
         if (user.avatar) {
            try {
               const publicId = user.avatar.split('/').pop().split('.')[0];
               // Если аватары лежат в папке, то publicId должен быть 'avatars/имя_файла'
               await cloudinary.uploader.destroy(`avatars/${publicId}`);
            } catch (err) {
               console.error("Ошибка удаления старого аватара:", err);
            }
         }
         avatarUrl = file.path;
      };

      // Финальное обновление
      const updatedUser = await query(
         `
         UPDATE users
         SET name = $1, phone = $2, delivery_address = $3, password_hash = $4, avatar = $5
         WHERE user_id = $6 RETURNING *
         `,
         [name || user.name, phone || user.phone, delivery_address || user.delivery_address, passwordHash, avatarUrl, userId]
      );

      const { password_hash, ...userData } = updatedUser.rows[0];
      return res.status(200).json({
         message: 'Профиль обновлен.',
         user: userData
      });

   } catch (error) {
      return res.status(500).json({
         message: 'Ошибка при обновлении профиля'
      })
   }
};