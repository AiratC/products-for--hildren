import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import FilterPage from "./pages/FilterPage/FilterPage";
import useScrollRestoration from "./hooks/useScrollRestoration";

function App() {
   useScrollRestoration();

   return (
      <>
         <Routes>
            <Route element={<MainLayout />}>
               <Route index element={<HomePage />}></Route>
               {/* Search Page */}
               <Route path="/search" element={<SearchPage />}></Route>
               {/* Filter Page */}
               <Route path="/categories/filter/:slug" element={<FilterPage />}></Route>
            </Route>
         </Routes>
      </>
   )
}

export default App
