import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import FilterPage from "./pages/FilterPage/FilterPage";
import useScrollRestoration from "./hooks/useScrollRestoration";
import Register from "./components/Register/Register";
import { Toaster } from 'react-hot-toast';

function App() {
   useScrollRestoration();

   return (
      <>
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
