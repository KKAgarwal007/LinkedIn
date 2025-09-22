import Notification from "../model/notification.model.js"

export const getNotifications = async (req, res)=>{
    try {
        let notification = await Notification.find({receiver:req.userId}).populate("relatedUser","firstName lastName profileImage username").populate("relatedPost","image description")
        if(!notification){
            return res.status(400).json({message: "there is no notification here"});
        }
        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({message: `getNotifcaiton error ${error}`});
    }
}

export const deleteNotification = async (req, res)=>{
    try {
        let {id} = req.params;
        let notification = await Notification.findOneAndDelete({
            _id: id,
            receiver: req.userId,
        })
        return res.status(200).json({message: "notification delete successfully"});
    } catch (error) {
        return res.status(500).json({message: `deleteNotification error ${error}`});
    }
}

export const clearAllNotifications = async (req, res)=>{
    try {

        let notification = await Notification.deleteMany({
            receiver: req.userId,
        })
        return res.status(200).json({message: "All notifications are cleared"});
    } catch (error) {
        return res.status(500).json({message: `ClearAllNotification error ${error}`});
    }
}