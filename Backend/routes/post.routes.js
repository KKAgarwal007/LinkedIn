import express from 'express';
import { Comments, createPost, getPost, Like } from '../controllers/post.controller.js';
import { isauth } from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const postRouter = express.Router();

postRouter.post("/create",isauth,upload.single("image"),createPost)
postRouter.get("/getpost",isauth,getPost);
postRouter.get("/like/:id",isauth,Like);
postRouter.post("/comment/:id",isauth,Comments);



export default postRouter;