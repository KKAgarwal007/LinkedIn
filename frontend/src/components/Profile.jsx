import React, { useContext, useEffect, useState } from 'react'
import Nav from './Nav'
import dp from '../assets/profile.png'
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { UserContextData } from '../context/UserContext';
import { MdEdit } from "react-icons/md";
import EditProfile from './EditProfile';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from './Post';
import ConnectionButton from './ConnectionButton';

function Profile() {
       let {serverUrl} = useContext(authDataContext);
    let { UserData, edit, setEdit, postData, setPostData, getProfile, setGetProfile} = useContext(UserContextData);
    let [profilePost, setProfilePost] = useState([]);
    
    useEffect(()=>{
      setProfilePost(postData.filter((post)=>post.author._id == getProfile._id))
    },[getProfile])
    console.log(profilePost)
  return (
    <div className='w-full min-h-[100vh] flex flex-col items-center bg-[#e9eae7]'>
        <Nav/>
        {edit && <EditProfile/>}
        <div className='w-full max-w-[900px] min-h-[100vh] pt-[100px] gap-[10px] flex flex-col items-center justify-center pb-[50px]'>
            <div className='w-full relative bg-white shadow-lg p-[10px] pb-[50px]'> 
                    {getProfile._id == UserData._id && <div className='w-full h-[200px] bg-gray-500 flex justify-center items-center rounded overflow-hidden' onClick={() => setEdit(true)}>
                      <img src={getProfile.coverImage || ""} alt="" />
                      <div className='absolute right-[20px] top-[15px] text-gray-800 cursor-pointer'>
                        <IoCameraOutline className='text-white' />
                      </div>
                    </div>}

                    {getProfile._id != UserData._id && <div className='w-full h-[200px] bg-gray-500 flex justify-center items-center rounded overflow-hidden'>
                      <img src={getProfile.coverImage || ""} alt="" />
                    </div>}


                    <div className='absolute top-[105px]'>
                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[65px] left-[30px]'>
                      <img src={getProfile.profileImage||dp} alt="" className='w-full h-full' />
            
                    </div>
                    <div className='w-[20px] h-[20px] bg-blue-500 absolute top-[105px] left-[82px] rounded-full flex justify-center items-center cursor-pointer' onClick={() => setEdit(true)}>
                      <FiPlus className='text-white' />
                    </div>
                    </div>
            
                    <div className='text-[24px] text-gray-800 font-semibold mt-[25px] pl-[10px]'>{`${getProfile.firstName} ${getProfile.lastName}`}</div>
                    <div className='text-[17px] text-gray-600 font-semibold pl-[10px]'>{getProfile.headline || ""}</div>
                    <div className='text-[15px] text-gray-500 font-semibold pl-[10px]'>{`${getProfile.location}`}</div>
                    <div className='text-[15px] text-gray-500 font-semibold pl-[10px]'>{`${getProfile.connection.length} connections`}</div>

                    {getProfile._id == UserData._id &&   <button className='w-[150px] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full mt-3 flex justify-center items-center gap-2' onClick={() => setEdit(true)}>Edit Profile<MdEdit className='text-blue-500' /></button>}

                    {getProfile._id != UserData._id && <div className='mt-[20px]'><ConnectionButton userId={getProfile._id}/></div>}
                  
            </div>
            <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>
                {`Post (${profilePost.length})`}
            </div>
            {profilePost.map((poster,index)=>(
                <Post  key={index} id={poster._id} author={poster.author} image={poster.image}  like={poster.like} comment={poster.comment} createdAt={poster.createdAt} description={poster.description}/>
            ))}

       

            {getProfile.skills.length > 0 &&  <div className='w-full min-h-[100px] bg-white flex flex-col justify-start items-start pl-[20px] text-[20px] text-gray-600 gap-[20px] pb-[30px] p-[20px]'><div className='pl-[10px] text-[24px] font-semibold'>skills:</div>
            <div className='flex gap-[20px] items-center'>
            {getProfile.skills.map((skill, index)=>(
              <div key={index} className='text-[20px] text-gray-200 bg-gray-600 px-5 py-2 rounded-full'>{skill}</div>
            ))}
          {getProfile._id == UserData._id &&   <button className='w-[150px] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full flex justify-center items-center gap-2' onClick={() => setEdit(true)}>Add Skill</button>
            }
            
            </div>
            </div>}

            {getProfile.education.length > 0 &&  <div className='w-full min-h-[100px] bg-white flex flex-col justify-start items-start pl-[20px] text-[20px] text-gray-600 gap-[20px] pb-[30px] p-[20px]'><div className='pl-[10px] text-[24px] font-semibold'>Education:</div>
            <div className='flex flex-col gap-[20px] '>
            {getProfile.education.map((edu, index)=>(
              <div key={index} className='pl-[10px] flex flex-col justify-start items-start gap-2.5'>
              <div>College: {edu.college}</div>
              <div>Degree: {edu.degree}</div>
              <div>Field of Study: {edu.fieldOfStudy} </div>
              </div>
            ))}
            {getProfile._id == UserData._id &&   <button className='w-[150px] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full flex justify-center items-center gap-2' onClick={() => setEdit(true)}>Add Education</button>
            }
            </div>
            </div>}



             {getProfile.experience.length > 0 &&  <div className='w-full min-h-[100px] bg-white flex flex-col justify-start items-start pl-[20px] text-[20px] text-gray-600 gap-[20px] pb-[30px] p-[20px]'><div className='pl-[10px] text-[24px] font-semibold'>Experience:</div>
            <div className='flex flex-col gap-[20px] '>
            {getProfile.experience.map((exp, index)=>(
              <div key={index} className='pl-[10px] flex flex-col justify-start items-start gap-2.5'>
              <div>Title: {exp.title}</div>
              <div>Company: {exp.company}</div>
              <div>Description: {exp.description} </div>
              </div>
            ))}
            {getProfile._id == UserData._id &&   <button className='w-[150px] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full flex justify-center items-center gap-2' onClick={() => setEdit(true)}>Add Experience</button>
            }
            </div>
            </div>}
          
            
            </div>
        </div>
  )
}

export default Profile