import React, { useContext, useEffect, useState } from 'react'
import Nav from './Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import dp from '../assets/profile.png'

function Notification() {
    let {serverUrl} = useContext(authDataContext);
    let [notificationData, setNotificationData] = useState([]);
    const handleGetNotification = async ()=>{
        try {
            let result = await axios.get(serverUrl + "/notification/get",{withCredentials:true});
            console.log(result.data);
            setNotificationData(result.data);
        } catch (error) {
            console.log(error);
        }
    }
     const handleDeleteOne = async (id)=>{
        try {
            let result = await axios.delete(serverUrl + `/notification/deleteone/${id}`,{withCredentials:true});
            console.log(result.data);
            await handleGetNotification();
        } catch (error) {
            console.log(error);
        }
    }

     const handleClearAllNotification = async ()=>{
        try {
            let result = await axios.delete(serverUrl + `/notification`,{withCredentials:true});
            console.log(result.data);
            await handleGetNotification();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        handleGetNotification();
    },[]);



    function handleType(type){
      if(type == "like"){
        return "liked your post";
      }
      else if(type == "comment"){
        return "commented on your post";
      }
      else{
        return "accepted your connection";
      }
    }
  return (
    <div className='w-full min-h-screen bg-[#e9eae7] pt-[100px] p-[10px] flex flex-col justify-start items-center gap-[20px]'>
        <Nav/>
          <div className='w-[100%] h-[100px] bg-white p-[20px] shadow-lg rounded-lg text-[20px] flex justify-between items-center'>
          Notification {notificationData.length}

          {notificationData.length>0 &&   <button className='w-[100px] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full mt-3 flex justify-center items-center gap-2' onClick={handleClearAllNotification}>clear All</button>}
            
        </div>
 
        <div className='w-full min-h-[100px] flex justify-center items-center'>

          {(notificationData.length>0) && <div className='w-full min-h-[100px] flex justify-center items-center flex-col gap-3'>
                  
                    {notificationData.map((noti, index) =>(
                      <div className='w-[100%] max-w-[800px] bg-white shadow-lg rounded-lg p-[20px] flex flex-col items-start  justify-between relative' key={index}>
                      <div className='flex items-center justify-center gap-[10px]'>
                         <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
                                      <img src={noti.relatedUser.profileImage||dp} alt="" className='w-full h-full' />
                                  </div>
                      <div>
                          <div className='text-[20px] text-gray-700 font-semibold'>{`${noti.relatedUser.firstName} ${noti.relatedUser.lastName} ${handleType(noti.type)}`}</div>
                      </div>
                      </div>
                        {noti.relatedPost && <div className='flex items-center ml-[100px] gap-[20px]'>
                          <div className='w-[100px] h-[100px] overflow-hidden'>
                              <img src={noti.relatedPost.image} alt="" className='h-full' />
                          </div>
                          <div className='w-[200px] h-[100px] flex items-center justify-center'>
                            {`${noti.relatedPost.description.slice(0,52)}`}...
                          </div>
                          </div>}
                                           
                  <div className='absolute right-3 top-5'>
                       <RxCross2 className='w-[20px] h-[20px] text-gray-600 font-bold cursor-pointer' onClick={()=>handleDeleteOne(noti._id)}/>
                  </div>
                  </div>
 
                
                    ))}
                  </div>}
                    </div>
    </div>
  )
}

export default Notification