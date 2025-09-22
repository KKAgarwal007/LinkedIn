import express, { Router } from 'express';
import {isauth} from '../middlewares/isAuth.js';
import { getCurrentUser, getProfile, getSuggestedUsers, Search, updateProfile } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get('/currentuser',isauth,getCurrentUser);
userRouter.put('/updateuser',isauth,upload.fields([
    {name: "profileImage",maxCount:1},
    {name: "coverImage",maxCount:1}
]),updateProfile);
userRouter.get('/profile/:username',isauth,getProfile);
userRouter.get('/search',isauth,Search);
userRouter.get('/suggestedusers',isauth,getSuggestedUsers);


export default userRouter;