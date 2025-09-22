import express from 'express';
import { isauth } from '../middlewares/isAuth.js';
import { clearAllNotifications, deleteNotification, getNotifications } from '../controllers/notification.controller.js';

const notificationRouter = express.Router();
notificationRouter.get('/get',isauth,getNotifications);
notificationRouter.delete('/deleteone/:id',isauth,deleteNotification);
notificationRouter.delete('/',isauth,clearAllNotifications);
export default notificationRouter;