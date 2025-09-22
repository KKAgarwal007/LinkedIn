import mongoose  from "mongoose";

const connectdb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("db is connected");
    }catch(err){
        console.log("db is not connected");
    }
}

export default connectdb;