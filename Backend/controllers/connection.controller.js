import Connection from "../model/connection.model.js";
import Notification from "../model/notification.model.js";
import User from "../model/usermodel.js";
import { io, UserSocketMap } from "../server.js";

export const Send = async (req, res)=>{
    try {
        let {id} = req.params;
        let sender = req.userId;
        let user = await User.findById(sender);
        if(sender == id){
            return res.status(400).json({message: "user cannot send request his own id"});
        }
        if(user.connection.includes(id)){
            return res.status(400).json({message: "User already connected"})
        }
        let existconnection = await Connection.findOne({
            sender,
            reciever: id,
            status: "pending"
        });
        if(existconnection){
            return res.status(400).json({message: "The connection request already send"});
        }
        let newConnection = await Connection.create({
            sender: sender,
            reciever: id
        })

        let receiverId = UserSocketMap.get(id.toString());
        let senderId = UserSocketMap.get(sender.toString());
        if(receiverId){
            io.to(receiverId).emit("statusUpdate",{updateUserId: sender, newState: "received"})
        }
        if(senderId){
            io.to(senderId).emit("statusUpdate",{updateUserId: id, newState: "pending"})
        }
        return res.status(200).json(newConnection);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "send connection error"});
    }
}

export const acceptConnection = async (req, res) =>{
    try {
        let {connectionid} = req.params;
        let connection = await Connection.findById(connectionid);
        if(!connection){
            return res.status(400).json({message: "connection does not exist"});
        }
        if(connection.status != "pending"){
            return res.status(400).json({message: "the connection is in under process"});
        }
        connection.status = "accepted";
          let notification = await Notification.create({
                receiver: connection.sender,
                type: "connectionAccepted",
                relatedUser: req.userId,
            })
        await connection.save();
        await User.findByIdAndUpdate(req.userId,{
            $addToSet: {connection:connection.sender._id}
        })
        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: {connection: req.userId}
        });

        let receiverId = UserSocketMap.get(connection.reciever._id.toString());
        let senderId = UserSocketMap.get(connection.sender._id.toString());
        if(receiverId){
            io.to(receiverId).emit("statusUpdate",{updateUserId: connection.sender._id, newState: "disconnect"})
        }
        if(senderId){
            io.to(senderId).emit("statusUpdate",{updateUserId: req.userId, newState: "disconnect"})
        }
        return res.status(200).json({message: "connection accepted"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "connection accepted error"})
    }
}

export const rejectConnection = async (req, res) =>{
    try {
        let {connectionid} = req.params;
        let connection = await Connection.findById(connectionid);
        if(!connection){
            return res.status(400).json({message: "connection does not exist"});
        }
        if(connection.status != "pending"){
            return res.status(400).json({message: "the connection is in under process"});
        }
        connection.status = "rejected";
        await connection.save();

            let receiverId = UserSocketMap.get(otherUserId);
        let senderId = UserSocketMap.get(myId);
        if(receiverId){
            io.to(receiverId).emit("statusUpdate",{updateUserId: myId, newState: "connect"})
        }
        if(senderId){
            io.to(senderId).emit("statusUpdate",{updateUserId: otherUserId, newState: "connect"})
        }
    
        return res.status(200).json({message: "connection rejected"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "connection rejected error"})
    }
}

export const getConnectionStatus = async (req, res)=>{
    try {   
        let targetedId = req.params.userId;
        let connectionId = req.userId;
        let currentUser = await User.findById(connectionId);
        if(currentUser.connection.includes(targetedId)){
            return res.json({status: "disconnect"});
        }
        const pendingRequest = await Connection.findOne({
            $or:
            [ {sender: targetedId , reciever: connectionId},
               {sender: connectionId, reciever: targetedId},
        ], status: "pending"});
        if(pendingRequest) {
            if(pendingRequest.sender.toString() === connectionId.toString()){
                return res.json({status: "pending"});
            }else{
                return res.json({status: "recieved", requestId: pendingRequest._id})
            }
        }

        return res.json({status: "connect"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "getconnectionstatus error"});
    }
}

export const removeConnection = async (req, res) =>{
    try {
        let myId = req.userId;
        let otherUserId = req.params.userId;
        await User.findByIdAndUpdate(myId, {
            $pull: {connection: otherUserId}
        })
        await User.findByIdAndUpdate(otherUserId, {
            $pull: {connection: myId}
        })

        return res.json({message: "connection removed successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "remove connection error"})
    }
}

export const getConnectionRequests = async (req, res) =>{
    try {
        let userId = req.userId;
        let request = await Connection.find({reciever: userId, status: "pending"}).populate("sender","firstName lastName email username profileImage headline")

        res.status(200).json(request);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "connection request error"})
    }
}

export const getUserConnections = async (req, res) =>{
    try {
        let userId = req.userId;
        let user = await User.findById(userId).populate("connection","firstName lastName email username profileImage headline connection");
        return res.status(200).json(user.connection)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "getUserConncetions error"});
    }
}