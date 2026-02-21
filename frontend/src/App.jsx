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
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import { fetchFavorites } from "./redux/slices/favoriteSlice";
import { fetchCart } from "./redux/slices/cartSlice";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import BlogPage from "./pages/BlogPage/BlogPage";

function App() {
   useScrollRestoration();
   const { isCheckingAuth } = useSelector((state) => state.authUser);

   const dispatch = useDispatch()

   useEffect(() => {
      dispatch(checkAuth());
      dispatch(fetchFavorites());
      dispatch(fetchCart());
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
            position="top-center"
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
               {/* Favorites Page */}
               <Route path="/favorites" element={<FavoritesPage/>}></Route>
               {/* Cart Page */}
               <Route path="/cart" element={<CartPage/>}></Route>
               {/* Checkout Page */}
               <Route path="/checkout" element={<CheckoutPage/>}></Route>
               {/* Page Not Found */}
               <Route path="*" element={<PageNotFound/>}></Route>
               {/* Order Page */}
               <Route path="/orders" element={<OrdersPage/>}></Route>
               {/* Profile Page */}
               <Route path="/settings" element={<ProfilePage/>}></Route>
               {/* Blog Page */}
               <Route path="/blogs" element={<BlogPage/>}></Route>
            </Route>
         </Routes>
      </>
   )
}

export default App
