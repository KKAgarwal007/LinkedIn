import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../model/notification.model.js";
import Post from "../model/post.model.js";
import { io } from "../server.js";

export const createPost = async (req, res)=>{
    try {
        let {description} = req.body;
        let newPost;
        if(req.file){
            let image = await uploadOnCloudinary(req.file.path);
            newPost = await Post.create({
                author:req.userId,
                description,
                image
            })
        }else{
            newPost = await Post.create({
                author: req.userId,
                description
            })
        }

        return res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "post error"});
    }
}

export const getPost = async (req, res)=>{
    try {
        let post = await Post.find().populate("author","firstName lastName username headline profileImage").populate("comment.user","firstName lastName headline profileImage").sort({createdAt: -1});
        return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "post error"});
    }
}


export const Like = async (req, res)=>{
    try {
        let postId = req.params.id;
        let userId = req.userId;
        let post = await Post.findById(postId);
        if(post.like.includes(userId)){
           post.like =  post.like.filter((id)=> id!=userId);
        }else{
            post.like.push(userId);
            if(post.author != userId){

                let notification = await Notification.create({
                    receiver: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId
                })
            }
        }
        await post.save();
        io.emit("likeUpdated",{postId, likes: post.like})
        return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "It can't be liked"});
    }
}

export const Comments = async (req, res)=>{
   try{
     let postId = req.params.id;
    let userId = req.userId;
    let {content} = req.body;
    let post = await Post.findByIdAndUpdate(postId,{
        $push : {comment: {content, user:userId}}
    },{new:true}).populate("comment.user","firstName lastName headline profileImage");
    
    if(post.author != userId){
                let notification = await Notification.create({
                    receiver: post.author,
                    type: "comment",
                    relatedUser: userId,
                    relatedPost: postId
                })
            }
    io.emit("commentAdded",{postId, comm: post.comment})
    return res.status(200).json(post)
   }catch(error){
         console.log(error);
        return res.status(500).json({message: "It can't be comment"});
   }
}

