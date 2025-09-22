import React, { createContext, use, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {io} from "socket.io-client";
export let socket = io("https://linkedin-backend-q389.onrender.com")

export const UserContextData = createContext();

function UserContext({children}) {
    let {serverUrl} = useContext(authDataContext);
    let [UserData, SetUserData] = useState(null);
    let [edit, setEdit] = useState(false);
    let [postData, setPostData] = useState([]);
    let [getProfile, setGetProfile] = useState(null);
    let navigate = useNavigate();

    const getCurrentUser = async ()=>{
        try{
            let result = await axios.get(serverUrl + "/user/currentuser",{
                withCredentials: true
            })
            SetUserData(result.data)
        }
        catch(error){
            console.log(error.response.data.message);
            SetUserData(null);
        }
    }


    const getPost = async ()=>{
        try {
            let result = await axios.get(serverUrl + "/post/getpost",{withCredentials:true})
            console.log(result);
            setPostData(result.data);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    const handleGetProfile = async (username)=>{
        try {
            let result = await axios.get(serverUrl + `/user/profile/${username}`,{withCredentials:true})
            setGetProfile(result.data);
            navigate("/profile");
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    useEffect(()=>{
        getCurrentUser();
        getPost();
    },[])
let value ={
    UserData, SetUserData,edit, setEdit, postData, setPostData, getPost, getProfile, setGetProfile, handleGetProfile
}
  return (
    <UserContextData.Provider value={value}>
        <div>{children}</div>

    </UserContextData.Provider>
  )
}

export default UserContext
