import React, { useContext, useEffect, useState } from 'react'
import logo2 from '../assets/logo2.png'
import { FaSearch } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import dp from '../assets/profile.png'
import { UserContextData } from '../context/UserContext';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
function Nav() {
  let [activeSearch, setActiveSearch] = useState(false);
    let {UserData, SetUserData, handleGetProfile} = useContext(UserContextData);
    let {serverUrl} = useContext(authDataContext);
    let [showPopUp, setShowPopUp] = useState(false)
    let [searchIn, setSearchIn] = useState("");
    let [searchData, setSearchData] = useState([]);
    let navigator = useNavigate();
    const HandleSignOut = async ()=>{
      try {
        let result = await axios.get(serverUrl + "/auth/logout",{
          withCredentials: true
        })
        SetUserData(null)
        console.log(result)
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    const handleSearch = async ()=>{
      try {
        let result = await axios.get(serverUrl + `/user/search?query=${searchIn}`,{withCredentials:true});
        console.log(result.data)
        setSearchData(result.data.users);
      } catch (error) {
        setSearchData([])
        console.log(error.response.data.message);
      }
    }

    useEffect(()=>{
        handleSearch();
    },[searchIn]);
  
  return (
    <div className='w-full h-[80px] bg-white fixed shadow-lg flex justify-between md:justify-around items-center top-0 md:p-0 px-[20px] left-0 z-[10]'>
      <div className='flex justify-center items-center gap-[10px]'>
      <div onClick={()=>{setActiveSearch(false)}}>
        <img src={logo2} alt="" className='w-[50px]' />
      </div>

          
    {!activeSearch && <div><FaSearch className='w-[20px] h-[20px] text-gray-600 lg:hidden' onClick={()=>{setActiveSearch(true)}}/></div>
    }
    {searchData.length > 0 && searchIn && <div className='absolute top-[81px] left-0 lg:left-[256px] shadow-lg bg-white min-h-[100px] max-h-[500px] w-[100%] md:max-w-[500px] flex flex-col p-[20px] gap-[20px] overflow-y-auto'>
    {searchData.map((sea)=>(
    <div className='flex items-center gap-[20px] border-b-2 border-b-gray-400 pb-2 p-[10px] hover:bg-gray-200 rounded-lg cursor-pointer' onClick={()=>handleGetProfile(sea.username)}>
      <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
              <img src={sea.profileImage||dp} alt="" className='w-full h-full' />
      </div>
      <div className='flex flex-col gap-1'>
         <div className='text-[18px] text-gray-700 font-semibold'>{`${sea.firstName} ${sea.lastName}`}</div>
           <div className='text-[15px] text-gray-600 font-semibold'>{sea.headline || ""}</div>
      </div>
    </div>
    ))}
    </div>}

      <form className={`w-[200px] lg:w-[300px] h-[40px] bg-[#e9eae7] lg:flex justify-start items-center px-[10px] gap-[10px] ${!activeSearch?"hidden":"flex"}`}>
          <div><FaSearch className='w-[20px] h-[20px] text-gray-600'/></div>
          <input type="text" className='w-[80%] h-full bg-transparent border-0 outline-none' placeholder='search users...' value={searchIn} onChange={(e)=>setSearchIn(e.target.value)}/>

      </form>
      </div>


      <div className='flex justify-center items-center gap-[30px]'>
        {showPopUp &&  <div className='w-[300px] min-h-[330px] absolute top-[85px] right-[20px] md:right-[100px] bg-white flex flex-col items-center p-[5px] gap-[18px]' >
          <div className='w-[80px] h-[80px] rounded-full overflow-hidden'>
              <img src={UserData.profileImage||dp} alt="" className='w-full h-full' />
          </div>
          <div className='text-[20px] text-gray-700 font-semibold'>{`${UserData.firstName} ${UserData.lastName}`}</div>
          <button className='w-[95%] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full' onClick={()=>handleGetProfile(UserData.username)}>View Profile</button>
          <div className='w-[100%] h-[1px] bg-gray-300'></div>
          <div className='w-full flex justify-start items-center gap-[10px]'>
            <div className='flex justify-center items-center gap-[10px] cursor-pointer' onClick={()=>navigator("/network")}>
                <FaUserGroup className='w-[25px] h-[25px] text-gray-600 '/>
          <div>My Network</div>

            </div>
          
          </div>
          <button className='w-[95%] h-[40px] border-2 border-red-500 text-[18px] text-red-500 rounded-full' onClick={HandleSignOut} >Sign Out</button>
        </div> }
       
          <div className='lg:flex flex-col justify-center items-center mr-[10px] hidden cursor-pointer' onClick={()=> navigator("/")}>
            <TiHome className='w-[22px] h-[22px] text-gray-600'/>
            <div>Home</div>
          </div>
          <div className='md:flex flex-col justify-center items-center hidden cursor-pointer' onClick={()=> navigator('/network')}>
            <FaUserGroup className='w-[22px] h-[22px] text-gray-600'/>
            <div>My Network</div>
          </div>
          <div className='flex flex-col justify-center items-center cursor-pointer' onClick={()=>navigator('/notification')}>
           <IoNotificationsSharp className='w-[22px] h-[22px] text-gray-600'/>
            <div className='hidden md:block'>Notifications</div>
          </div>
          <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer'onClick={()=>setShowPopUp(prev => !prev)}>
            <img src={UserData.profileImage||dp} alt="" className='w-full h-full' />
          </div>
      </div>
    </div>
  )
}

export default Nav