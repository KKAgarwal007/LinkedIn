import express from 'express';
import { acceptConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, Send } from '../controllers/connection.controller.js'
import { isauth } from '../middlewares/isAuth.js';

const connectionRouter = express.Router();

connectionRouter.post('/send/:id',isauth,Send);
connectionRouter.put('/accept/:connectionid',isauth,acceptConnection)
connectionRouter.put('/reject/:connectionid',isauth,rejectConnection)
connectionRouter.get('/getstatus/:userId',isauth,getConnectionStatus)
connectionRouter.delete('/remove/:userId',isauth,removeConnection)
connectionRouter.get('/requests',isauth,getConnectionRequests)
connectionRouter.get('/',isauth,getUserConnections)




export default connectionRouter;