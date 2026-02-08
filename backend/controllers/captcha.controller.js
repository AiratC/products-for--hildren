import svgCaptcha from 'svg-captcha';

export const getCaptcha = (req, res) => {
   try {
      // Генерируем каптчу: текст + SVG
      const captcha = svgCaptcha.create({
         size: 4, // Кол-во символов
         noise: 3, // кол-во линий шума
         color: true, // Цветные символы
         background: '#f0f8ff' // Цвет фона
      })

      // Сохраняем в сессию
      req.session.captcha = captcha.text.toLowerCase();

      return res.status(200).json({
         success: true,
         captcha: captcha.data,
         error: false
      });
   } catch (error) {
      console.log(error)
      return res.status(500).json({
         success: false,
         error: true,
         message: 'Ошибка при генерации капчи на сервере'
      })
   }
};
