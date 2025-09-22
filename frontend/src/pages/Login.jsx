import React, { use, useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { UserContextData } from '../context/UserContext';

function Login() {
   let {serverUrl} = useContext(authDataContext);
    let [click, setclick] = useState(true)
    let navigate = useNavigate("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let [err, setErr] = useState("");
    let {UserData, SetUserData} = useContext(UserContextData);
    

    const handleLogIn = async (e)=>{
      e.preventDefault();
      setLoading(true)
      try{
        let result = await axios.post(serverUrl + "/auth/login",{
          email,
          password
        },{
          withCredentials: true
        })
        console.log(result);
        setLoading(false)
        setErr("")
        SetUserData(result.data.existUser)
        navigate('/')
        setEmail("")
        setPassword("")
      }catch(error){
        setErr(error.response.data.message)
        setLoading(false)
      }
    }
  return (
    <div className='w-full h-screen bg-white flex flex-col justify-start items-center'>
        <div className='p-[30px] lg:p-[40px] w-full h-[30px] flex items-center'>
        <img src={logo} alt=""/>
        </div>
        <form className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center items-start p-[20px] gap-[10px]' onSubmit={handleLogIn}>
            <h1 className='text-gray-900 text-[30px] font-semibold mb-[30px]'>Sign In</h1>
            <input type="text" placeholder='Enter your email' required className='w-full h-[50px] border-2 border-gray-400 text-gray-900 text-[18px] px-[20px] rounded-md outline-gray-950' value={email} onChange={(e)=> setEmail(e.target.value)}/>
            <div className='w-full h-[50px] border-2 border-gray-400 text-gray-900 text-[18px] rounded-md outline-gray-950 relative'>
                <input type={click?"password":"text"} placeholder='Enter your password' required className='w-full h-full border-none  text-gray-900 text-[18px] px-[20px] rounded-md' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                <span className='absolute right-[15px] top-[12px] text-blue-500 text-[25px] font-semibold cursor-pointer' onClick={()=> setclick(!click)}>{click?<FaRegEyeSlash/>:<FaRegEye/>}</span>
            </div>
            {err && <p className='w-full text-center text-red-500'>{err}</p>}
            <button className='w-full flex items-center justify-center bg-blue-500 p-[12px] rounded-full mt-[40px] text-white font-semibold text-[18px]' disabled={loading}>{loading?"Loading...":"Sign In"}</button>
            <p className='w-full text-center'>Want to create an account? <span className=' text-blue-500 font-semibold cursor-pointer' onClick={()=> navigate("/signup")}>Sign Up</span></p>
        </form>
    </div>
  )
}

export default Login