import { query } from "../config/db.js";

export const getMe = async (req, res) => {
   try {
      const userResult = await query(
         `SELECT * FROM Users WHERE user_id = $1`,
         [req.userId]
      );

      if(userResult.rows.length === 0) {
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
}