import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollRestoration = () => {
   const { pathname } = useLocation();

   useEffect(() => {
      // 1. При уходе со страницы сохраняем позицию в историю браузера
      const handleScroll = () => {
         const scrollPos = window.scrollY;
         window.history.replaceState({ ...window.history.state, scrollPos }, "");
      };

      window.addEventListener("scroll", handleScroll);

      // 2. При возвращении на страницу проверяем, есть ли сохраненная позиция
      const savedPos = window.history.state?.scrollPos;

      if (savedPos) {
         // Ждем, пока страница "вырастет" в высоту, чтобы было куда скроллить
         const timer = setTimeout(() => {
            window.scrollTo({
               top: savedPos,
               behavior: "instant", // Делаем прыжок мгновенным
            });
         }, 100); // Небольшая задержка для рендеринга React

         return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
         };
      }

      return () => window.removeEventListener("scroll", handleScroll);
   }, [pathname]);
};

export default useScrollRestoration;
