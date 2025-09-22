import React, { useContext, useEffect, useState } from 'react'
import Nav from './Nav'
import { authDataContext } from '../context/AuthContext'
import dp from '../assets/profile.png'
import axios from 'axios';
import moment from 'moment';
import { IoCheckmarkCircleOutline } from "react-icons/io5"
import { RxCrossCircled } from "react-icons/rx";

function Network() {
  let {serverUrl} = useContext(authDataContext);
  let [connections, setConnections] = useState([]);
  const handleGetRequest = async()=>{
    try {
      let result = await axios.get(serverUrl + "/connection/requests",{withCredentials:true})
      console.log(result.data);
      setConnections(result.data)
    } catch (error) {
      console.log(error.data);
    }
  }

  const handleAcceptRequest = async(requestId)=>{
    try {
      let result = await axios.put(serverUrl + `/connection/accept/${requestId}`,{},{withCredentials:true})
      setConnections(connections.filter((con)=>con._id == requestId));
    } catch (error) {
      console.log(error);
    }
  }
  const handleRejectRequest = async(requestId)=>{
    try {
      let result = await axios.put(serverUrl + `/connection/accept/${requestId}`,{},{withCredentials:true})
      setConnections(connections.filter((con)=>con._id == requestId));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    handleGetRequest();
  },[])
  return (
    <div className='w-full h-screen bg-[#e9eae7] pt-[100px] p-[10px] flex flex-col justify-start items-center gap-[20px]'>
        <Nav/>
        <div className='w-[100%] h-[100px] bg-white p-[20px] shadow-lg rounded-lg text-[20px] flex justify-start items-center'>
          Invitations {connections.length}
        </div>

        {(connections.length>0) && <div className='w-full h-[100px] flex justify-center items-center'>
          
            {connections.map((connection, id) =>(
            <div className='w-[100%] max-w-[800px] h-[100px] bg-white shadow-lg rounded-lg p-[20px] flex items-center justify-between'>
              <div className='flex items-center justify-center gap-[10px]'>
                 <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
                              <img src={connection.sender.profileImage||dp} alt="" className='w-full h-full' />
                          </div>
              <div>
                  <div className='text-[20px] text-gray-700 font-semibold'>{`${connection.sender.firstName} ${connection.sender.lastName}`}</div>
                  <div className='text-[17px] text-gray-600 font-semibold'>{connection.sender.headline || ""}</div>
              </div>
              </div>

              <div className='flex justify-center items-center gap-[10px]'>
                <button className='w-[40px] h-[40px]' onClick={()=>handleAcceptRequest(connection._id)}>
                    <IoCheckmarkCircleOutline className='w-full h-full text-blue-500'/>
                </button>
                <button className='w-[38px] h-[38px]' onClick={()=>handleRejectRequest(connection._id)}>
                    <RxCrossCircled className='w-full h-full text-red-500'/>
                </button>
              </div>
          </div>
            ))}
          </div>}
    </div>
  )
}

export default Network