import express from 'express';
import dotenv from 'dotenv';
import connectdb from './config/dbconnect.js';
import userRoute from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './routes/auth.routes.js';
import postRouter from './routes/post.routes.js';
import connectionRouter from './routes/connection.routes.js';
import http from 'http';
import { Server } from 'socket.io';
import notificationRouter from './routes/notification.routes.js';
dotenv.config();
const app = express();
let server = http.createServer(app);
export const io = new Server(server,{
    cors: ({
    origin: "https://linkedin-frontend-byf4.onrender.com",
    credentials: true
})
})
app.use(cors({
    origin: "https://linkedin-frontend-byf4.onrender.com",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000
app.use("/auth",authRoute);
app.use("/user",userRoute);
app.use("/post",postRouter);
app.use("/connection",connectionRouter)
app.use("/notification",notificationRouter)
export const UserSocketMap = new Map();
io.on("connection",(socket)=>{
 

    socket.on("register",(userId)=>{
        UserSocketMap.set(userId, socket.id);
        console.log(UserSocketMap);
    })
    socket.on("disconnect",(socket)=>{

    })
})
server.listen(port, ()=>{
    connectdb();
    console.log("server started");
})
