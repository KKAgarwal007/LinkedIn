import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import dp from '../assets/profile.png'
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { UserContextData } from '../context/UserContext';
import { MdEdit } from "react-icons/md";
import EditProfile from '../components/EditProfile';
import { RxCross2 } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa6";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post';



function Home() {
  let [description, setDescription] = useState("");
  let [frontendImage, setFrontendImage] = useState();
  let [backendImage, setBackendImage] = useState();
  let { UserData, SetUserData, edit, setEdit, postData, setPostData, getPost,handleGetProfile} = useContext(UserContextData);
  let { serverUrl } = useContext(authDataContext);
  let image = useRef();
  let [upload, setUpload] = useState(false);
  let [post, setPost] = useState(false);
  let [suggestedUser, setSuggestedUser] = useState([])


  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  const handlePost = async () => {
    try {
      setPost(true)
      let formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) {
        formdata.append("image", backendImage);
      }

      let result = await axios.post(serverUrl + "/post/create", formdata, { withCredentials: true })
      console.log(result.data);
      setUpload(false)
      setPost(false)
    }
    catch (error) {
      console.log(error.response.data.message);
      setUpload(false)
      setPost(false)
    }
    useEffect(() => {
      getPost();
    }, [])
  }


  const handleGetSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/user/suggestedusers", { withCredentials: true })
      console.log(result.data)
      setSuggestedUser(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetSuggestedUsers();
  }, [])
  return (
    <div className='w-full min-h-[100vh] bg-[#e9eae7] pt-[100px] flex lg:flex-row flex-col lg:justify-center justify-start lg:items-start items-center px-[20px] gap-[20px] relative'>
      {edit && <EditProfile />}
      <Nav />
      <div className=' lg:w-[25%] w-full min-h-[200px] bg-white shadow-lg rounded-lg p-[10px] relative'>
        <div className='w-full h-[100px] bg-gray-500 flex justify-center items-center rounded overflow-hidden relative' onClick={() => setEdit(true)}>
          <img src={UserData.coverImage || ""} alt="" />
          <div className='absolute right-[20px] top-[15px] text-gray-800 cursor-pointer'>
            <IoCameraOutline className='text-white' />
          </div>
        </div>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[65px] left-[30px]'>
          <img src={UserData.profileImage || dp} alt="" className='w-full h-full' />

        </div>
        <div className='w-[20px] h-[20px] bg-blue-500 absolute top-[105px] left-[82px] rounded-full flex justify-center items-center cursor-pointer' onClick={() => setEdit(true)}>
          <FiPlus className='text-white' />
        </div>

        <div className='text-[20px] text-gray-700 font-semibold mt-[25px] pl-[10px]'>{`${UserData.firstName} ${UserData.lastName}`}</div>
        <div className='text-[17px] text-gray-600 font-semibold pl-[10px]'>{UserData.headline || ""}</div>
        <div className='text-[15px] text-gray-500 font-semibold pl-[10px]'>{`${UserData.location}`}</div>
        <button className='w-[95%] h-[40px] border-2 border-blue-500 text-[18px] text-blue-500 rounded-full mt-3 flex justify-center items-center gap-2' onClick={() => setEdit(true)}>Edit Profile<MdEdit className='text-blue-500' /></button>

      </div>


      {upload && <div className='w-full h-full fixed top-0 z-[100] opacity-[0.7] bg-gray-600 left-0'>
      </div>}

      {upload && <div className='w-[90%] max-w-[500px] h-[550px] bg-white fixed z-[200] flex flex-col justify-start items-start p-[20px] gap-[20px]'>
        <div className='absolute top-[15px] right-[20px]'><RxCross2 className='w-[24px] h-[24px] text-gray-600 font-bold cursor-pointer' onClick={() => setUpload(false)} /></div>

        <div className='flex justify-center items-center gap-[20px]'>

          <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            <img src={UserData.profileImage || dp} alt="" className='w-full h-full' />
          </div>
          <div className='text-[22px] text-gray-700 font-semibold'>{`${UserData.firstName} ${UserData.lastName}`}</div>
        </div>

        <textarea className={`w-full ${frontendImage ? "h-[300px]" : "h-[400px]"} resize-none outline-none text-[18px] p-[10px] border-none`} placeholder='what do you want to ask about..?' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

        <input type="file" ref={image} hidden onChange={handleImage} />
        {frontendImage && <div className='w-full flex justify-center items-center rounded-lg'>
          <img src={frontendImage || ""} alt="" className='w-[150px] h-[150px] rounded-lg' />
        </div>}
        <div className='w-full flex flex-col justify-start items-start gap-[10px]'>
          <div>
            <FaRegImage className='w-[24px] h-[24px] text-gray-500 cursor-pointer' onClick={() => image.current.click()} />
          </div>
          <div className='w-full border-b-2 border-gray-500 '>
          </div>
          <div className='w-full flex justify-end items-center'>
            <button className='w-[100px] h-[40px] bg-blue-500 text-[18px] text-white rounded-full flex justify-center items-center gap-2 font-semibold' onClick={handlePost} disabled={post}>{post ? "Posting..." : "Post"}</button>
          </div>
        </div>
      </div>}

      <div className='lg:w-[50%] w-full min-h-[200px] shadow-lg flex flex-col gap-[20px] pb-[20px]'>
        <div className='w-full h-[120px] bg-white rounded-lg flex justify-center items-center gap-[20px]'>
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            <img src={UserData.profileImage || dp} alt="" className='w-full h-full' />
          </div>
          <button className='lg:w-[80%] w-[70%] h-[60px] border-2 border-gray-400 flex justify-start items-center px-[20px] rounded-full hover:bg-gray-200' onClick={() => setUpload(true)}>start a post</button>
        </div>

        {postData.map((poster, index) => (
          <Post key={index} id={poster._id} author={poster.author} image={poster.image} like={poster.like} comment={poster.comment} createdAt={poster.createdAt} description={poster.description} />
        ))}


      </div>






      <div className='lg:w-[25%] w-full min-h-[200px] bg-white shadow-lg hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-600 font-semibold'>
          Suggested Users
        </h1>
        {suggestedUser.length > 0 && <div className='flex flex-col gap-[10px] mt-4'>
              {suggestedUser.map((user)=>(
                 <div className='flex items-center gap-[20px] p-[10px] hover:bg-gray-200 rounded-lg cursor-pointer' onClick={()=>handleGetProfile(user.username)}>
                      <div className='w-[60px] h-[60px] rounded-full overflow-hidden'>
                              <img src={user.profileImage||dp} alt="" className='w-full h-full' />
                      </div>
                      <div className='flex flex-col gap-1'>
                         <div className='text-[17px] text-gray-700 font-semibold'>{`${user.firstName} ${user.lastName}`}</div>
                           <div className='text-[15px] text-gray-600 font-semibold'>{user.headline || ""}</div>
                      </div>
                    </div>
              ))}
          </div>}

        {suggestedUser.length == 0 && <div>
          No Suggested Users
        </div>}
      </div>



    </div>
  )
}

export default Home