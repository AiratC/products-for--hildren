
import { Routes, Route } from "react-router";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";

function App() {

   return (
         <Routes>
            <Route element={<MainLayout/>}>
               <Route index element={<HomePage/>}></Route>
               {/* Search Page */}
               <Route path="/search" element={<SearchPage/>}></Route>
            </Route>
         </Routes>
   )
}

export default App
