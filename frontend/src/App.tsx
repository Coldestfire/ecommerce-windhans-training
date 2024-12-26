import Loader from './components/Loader'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import MainLayout from './layout/MainLayout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, UserSlicePath } from "./provider/slice/user.slice"
import AdminHeader from './components/AdminHeader';



function App() { 
 const [loading, SetLoading] = useState(true)
 const navigate= useNavigate() 
     const dispatch = useDispatch()
     const selector = useSelector(UserSlicePath)

     const location = useLocation();  // Hook to get the current location/path
     const excludeHeaderPaths = ['/admin'];  // Define paths where the header should not be shown
 
 const fetchUser = async(token:string) => {
     try {
       const {data} = await axios.get(import.meta.env.VITE_BACKEND_URL+"/api/auth/profile",{
         headers:{
           'Authorization': 'Bearer ' + token
         }
       })
       console.log("logged in as: ", data.user.email);
       dispatch(setUser(data.user));
       console.log("set as: ", data.user);
       SetLoading(false)
       return
     } catch (error) {
       console.log(error);
       navigate("/login")

       return
     }

 }
 useEffect(() => {
       const token = localStorage.getItem("token") || ''
       if(!token){
         navigate("/login")
         return
       }else{
         if (selector?.email){
           SetLoading(false)
           return 
         }else{ 
           (async()=>{
             await fetchUser(token);
           })()
         }
       }

 }, [])


 if (loading){
     return <div><Loader /></div>
 }

 return (
   <>
       <QueryClientProvider client={queryClient}>
        
      {/* Conditionally render Header or AdminHeader based on the current path */}
      {excludeHeaderPaths.includes(location.pathname) ? <AdminHeader /> : <Header />}

       <MainLayout>

       <Outlet />
       </MainLayout>
       </QueryClientProvider>
    
   </>
 )
}

export default App