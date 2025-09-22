import React, { use, useContext, useEffect, useState } from 'react'
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import { UserContextData } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ConnectionButton({userId}) {
    let {serverUrl} = useContext(authDataContext);
    let {UserData} =useContext(UserContextData);
    let [status, setStatus] = useState("connect");
    let navigate = useNavigate();
    let socket = io(serverUrl);
    const handleSendConnection = async()=>{
        try {
            let result = await axios.post(serverUrl + `/connection/send/${userId}`,{},{withCredentials:true})
            console.log(result.data);
            setStatus(result.data.status)
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

      const handleRemoveConnection = async()=>{
        try {
            let result = await axios.delete(serverUrl + `/connection/remove/${userId}`,{withCredentials:true})
            console.log(result.data);
            setStatus("connect");
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

     const handleGetStatus = async()=>{
        try {
            let result = await axios.get(serverUrl + `/connection/getstatus/${userId}`,{withCredentials:true})
            console.log(result.data.status);
            setStatus(result.data.status);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    useEffect(()=>{
        socket.emit("register",UserData._id)
        handleGetStatus();

        socket.on("statusUpdate",({updateUserId, newState})=>{
            if(updateUserId == userId){
                setStatus(newState);
            }
        })

        return ()=>{
            socket.off("statusUpdate")
        }
    },[userId])



    const handleClick = async ()=>{
    
        if(status == "disconnect"){
            await handleRemoveConnection();
        }else if(status == "recieved"){
            navigate("/network");
        }
        else{
            await handleSendConnection();
        }
    }
  return (
      <button className='min-w-[120px] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full' onClick={handleClick} disabled={status=="pending"} >
        {status}
      </button>
  )
}

export default ConnectionButton