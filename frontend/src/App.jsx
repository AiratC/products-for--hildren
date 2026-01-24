import Navbar from "./components/Navbar/Navbar"
import { Routes, Route } from "react-router";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";

function App() {

   return (
      <>
      <Navbar/>
      <div className="container">
         <Routes>
            <Route element={<MainLayout/>}>
               <Route index element={<HomePage/>}></Route>
            </Route>
            {/* Search Page */}
            <Route path="/search" element={<SearchPage/>}></Route>
         </Routes>
      </div>
      </>
   )
}

export default App
