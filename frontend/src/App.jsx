import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import FilterPage from "./pages/FilterPage/FilterPage";
import useScrollRestoration from "./hooks/useScrollRestoration";
import Register from "./components/Register/Register";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/slices/authUserSlice";
import Loader from "./components/Loader/Loader";

function App() {
   useScrollRestoration();
   const { isCheckingAuth } = useSelector((state) => state.authUser);

   const dispatch = useDispatch()

   useEffect(() => {
      dispatch(checkAuth());
   }, [dispatch]);

   return (
      <>
         {/* Глобальный индикатор проверки, который не убирает Routes из DOM */}
         {isCheckingAuth && (
            <div style={{
               position: 'fixed',
               top: 0, left: 0,
               width: '100%', height: '100%',
               backgroundColor: 'white',
               zIndex: 9999,
               display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
               <Loader />
            </div>
         )}
         <Toaster
            position="top-right"
            toastOptions={{
               duration: 3000,
               removeDelay: 1000,
               success: {
                  duration: 3000,
                  iconTheme: {
                     primary: 'green',
                     secondary: 'black',
                  },
               },
            }}
         />
         <Routes>
            <Route element={<MainLayout />}>
               <Route index element={<HomePage />}></Route>
               {/* Search Page */}
               <Route path="/search" element={<SearchPage />}></Route>
               {/* Filter Page */}
               <Route path="/categories/filter/:slug" element={<FilterPage />}></Route>
               {/* Register Page */}
               <Route path="/register" element={<Register />}></Route>
            </Route>
         </Routes>
      </>
   )
}

export default App
