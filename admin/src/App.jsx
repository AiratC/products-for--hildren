import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./components/Dashboard/Dashboard"
import CategoryPage from "./pages/CategoryPage/CategoryPage"
import OrdersPage from "./pages/OrdersPage/OrdersPage"
import BlogPage from "./pages/BlogPage/BlogPage"
import OptPage from "./pages/OptPage/OptPage"
import Login from "./components/Login/Login"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import AuthAdmin from "./components/AuthAdmin/AuthAdmin"
import { useDispatch, useSelector } from "react-redux"
import { Spin } from "antd"
import { useEffect } from "react"
import { checkAuth } from "./redux/slices/authAdminSlice"
import CategoryProductsView from "./pages/CategoryProductsView/CategoryProductsView"


function App() {
   const { isCheckingAuth, loading, admin } = useSelector(state => state.authAdmin);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(checkAuth())
   }, [dispatch])

   if (isCheckingAuth || loading) {
      return <div style={{ textAlign: 'center' }}><Spin style={{ margin: '20px' }} /></div>
   }

   return (
      <Routes>
         <Route path="/" element={admin ? <Navigate to={`/dashboard`} replace/> : <Login />}></Route>
         <Route path="/dashboard" element={<AuthAdmin><Dashboard /></AuthAdmin>}>
            <Route index element={<Navigate to={`admin-profile`} replace />}></Route>
            <Route path="admin-profile" element={<ProfilePage />}></Route>
            <Route path="blog" element={<BlogPage />}></Route>
            <Route path="orders" element={<OrdersPage />}></Route>
            <Route path="opt" element={<OptPage />}></Route>
            <Route path="category" element={<CategoryPage />}></Route>
            <Route path="category-products-view/:id" element={<CategoryProductsView/>}></Route>
         </Route>
      </Routes>
   )
}

export default App
