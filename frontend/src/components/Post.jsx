import React, { useContext, useEffect, useState } from 'react'
import dp from '../assets/profile.png'
import moment from 'moment';
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { socket, UserContextData } from '../context/UserContext';
import { BiSolidLike } from "react-icons/bi";
import { VscSend } from "react-icons/vsc";

import ConnectionButton from './ConnectionButton';

function Post({id, author,image, like, comment, createdAt, description}) {
    let [more, setMore] = useState(true);
    let reader = more?"Read more...":"Read less...";
    let {serverUrl} = useContext(authDataContext);
    let {UserData,getPost,handleGetProfile} = useContext(UserContextData);
    let [likes, setLikes] = useState(like || []);
    let [commentContent, setCommentContent] = useState("");
    let [comments, setComments] = useState(comment || []);
    let [commentShow, setCommentShow] = useState(false);

    async function handleLike(){
        try{
            let result = await axios.get(serverUrl + `/post/like/${id}`,{
                withCredentials:true
            });
            console.log(result.data.like);
            setLikes(result.data.like);
        }catch(error){
            console.log(error);
        }
    }

     async function handleComment(e){
        e.preventDefault();
        try{
            let result = await axios.post(serverUrl + `/post/comment/${id}`,{
                content:commentContent
            },{
                withCredentials:true
            });
            console.log(result.data.comment);
            setComments(result.data.comment);
            setCommentContent("");
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        socket.on("likeUpdated",({postId, likes})=>{
            if(postId == id){
                setLikes(likes)
            }
        })
        socket.on("commentAdded",({postId, comm})=>{
            if(postId == id){
                setComments(comm);
            }
        })

        return ()=>{
            socket.off("timeUpdated");
            socket.off("commentAdded");
        }
    },[id])

    useEffect(()=>{
        getPost();
    },[likes,setLikes,comments])


  return (
    <div className='w-full min-h-[200px] bg-white p-[20px] flex flex-col gap-[20px]'>
        <div className='flex justify-between items-center'>
        <div className='flex justify-center items-center'>

        <div>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer' onClick={()=>{handleGetProfile(author.username)}}>
                <img src={author.profileImage||dp} alt="" className='w-full h-full' />
            </div>
        </div>
        <div>
             <div className='text-[20px] text-gray-700 font-semibold pl-[10px]'>{`${author.firstName} ${author.lastName}`}</div>
        <div className='text-[17px] text-gray-600 font-semibold pl-[10px]'>{author.headline || ""}</div>
        <div className='text-[14px] text-gray-600 font-semibold pl-[10px]'>{moment(createdAt).fromNow()}</div>
        
        </div>
        </div>

        <div>
            {UserData._id!=author._id && <ConnectionButton userId={author._id}/>}
            
        </div>
        </div>

        <div className='w-full min-h-[100px] pl-[20px] flex flex-col gap-[20px]'>
            <div>
            <div className={`w-full  ${more?"max-h-[100px] overflow-hidden":""} pl-[20px]`}>
            {description} 
            </div>
            <div className='text-[16px] pl-[20px] cursor-pointer font-semibold' onClick={()=>setMore(prev=>!prev)}>{description.length>500 && reader}</div>
            </div>

        {image && <div className='w-full h-[300px] overflow-hidden flex items-center justify-center rounded-lg'>
            <img src={image} alt="" className='h-full rounded-lg' />
        </div>} 
        </div>

        <div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-600'>
            {likes.includes(UserData._id) && <div className='flex items-center gap-[5px]'>
                <BiSolidLike className='w-[24px] h-[24px] cursor-pointer text-blue-500' onClick={handleLike}/> <span className='text-[18px]'>{likes.length}</span>
            </div>}
             {!likes.includes(UserData._id) && <div className='flex items-center gap-[5px]'>
                <BiLike className='w-[24px] h-[24px] cursor-pointer text-blue-500' onClick={handleLike}/> <span className='text-[18px]'>{likes.length}</span>
            </div>}
            <div className='flex items-center gap-[5px] text-[18px] cursor-pointer'>
                {comment.length} <span onClick={()=> setCommentShow(prev=>!prev)}>comments</span>
            </div>
        </div>

        <div className='w-full flex justify-end items-center px-[20px] gap-[10px]'>
            {!likes.includes(UserData._id) && <div className='flex items-center gap-[5px] cursor-pointer' onClick={handleLike}>
                <BiLike className='w-[20px] h-[20px] cursor-pointer'/> <span className='text-[18px]'>Like</span>
            </div>}

            {likes.includes(UserData._id) && <div className='flex items-center gap-[5px] text-blue-500 cursor-pointer' onClick={handleLike}>
                <BiSolidLike className='w-[20px] h-[20px] cursor-pointer'/> <span className='text-[18px]'>Liked</span>
            </div> }
            
            <div className='flex items-center gap-[5px] text-[18px] cursor-pointer' onClick={()=> setCommentShow(prev=>!prev)}>
               <FaRegCommentDots />
                 <span>comment</span>
            </div>
        </div>

      {commentShow &&   <div>
            <form className='w-full border-b-2 flex items-center justify-between' onSubmit={handleComment}>
                <input type="text" placeholder="leave a comment" className='w-full outline-none text-[18px] pl-[20px]' value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}/>
                <button><VscSend className='text-blue-500 text-[22px] mr-[10px]'/></button>
            </form>
        <div className='flex flex-col gap-[20px] pt-[30px]'>
             {comments.map((com)=>(
                 <div className='flex items-center border-b-2 pb-[10px]'>
                     <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                    <img src={com.user.profileImage||dp} alt="" className='w-full h-full' />
                    </div>
                <div className='w-full flex justify-between'>

                <div className='flex flex-col'>

                    <div className='text-[18px] text-gray-700 font-semibold pl-[10px]'>{`${com.user.firstName} ${com.user.lastName}`}</div>

                     <div className='text-[16px] text-gray-600 font-semibold pl-[10px]'>{com.content}</div>
                    </div>
                      <div className='text-[14px] text-gray-600 font-semibold pl-[10px]'>{moment(com.user.createdAt).fromNow()}</div>
                </div>
                </div>
             ))}
             </div>
        </div>}

      



    </div>
  )
}

export default Post