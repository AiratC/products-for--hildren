import { Route, Routes } from "react-router-dom"
import Dashboard from "./components/Dashboard/Dashboard"
import CategoryPage from "./pages/CategoryPage/CategoryPage"
import OrdersPage from "./pages/OrdersPage/OrdersPage"
import BlogPage from "./pages/BlogPage/BlogPage"
import OptPage from "./pages/OptPage/OptPage"


function App() {


   return (
      <Routes>
         <Route path="/dashboard" element={<Dashboard />}>
            <Route path="blog" element={<BlogPage />}></Route>
            <Route path="orders" element={<OrdersPage />}></Route>
            <Route path="opt" element={<OptPage />}></Route>
            <Route path="category" element={<CategoryPage />}></Route>
         </Route>
      </Routes>
   )
}

export default App
