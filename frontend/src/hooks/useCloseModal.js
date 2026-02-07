import React, { useEffect, useRef } from "react";

const useCloseModal = (onCloseModalWindow) => {
   const containerRef = useRef(null);

   useEffect(() => {

      const handleClickOutside = (event) => {
         if (containerRef.current && !containerRef.current.contains(event.target)) {
            onCloseModalWindow()
         }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };

   }, [onCloseModalWindow])

   return containerRef;
};

export default useCloseModal;
