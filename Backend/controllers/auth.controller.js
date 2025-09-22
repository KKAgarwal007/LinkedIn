import getToken from "../config/token.js";
import User from "../model/usermodel.js";
import bcyptjs from 'bcryptjs';

export const SignUp = async(req, res)=>{
    try{
        let {firstName, lastName, email, username, password} = req.body;
        let existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"Email already exist!"});
        }
        let existUsername = await User.findOne({username});
        if(existUsername){
            return res.status(400).json({message: "Username already exist!"});
        }
        if(password.length<8){
            return res.status(400).json({message: "password should have at least 8 characters"})
        }
        let hashpassword = await bcyptjs.hash(password,10);
        let user = await User.create({
            firstName,
            lastName,
            email,
            username,
            password:hashpassword
        });
        let token = await getToken(user._id)
        res.cookie('token',token,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "Strict",
            secure: process.env.NODE_ENVIRONMENT === "production"
        })

        return res.status(200).json({user});

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const Login = async(req, res)=>{
    try{
        let {email, password} = req.body;
        let existUser = await User.findOne({email});
        if(!existUser){
            return res.status(400).json({message: "Email does not exist"});
        }
        let compare = await bcyptjs.compare(password, existUser.password)
        if(!compare){
            return res.status(400).json({message: "Incorrect password"});
        }   
        let token = await getToken(existUser._id)
        res.cookie('token',token,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "Strict",
            secure: process.env.NODE_ENVIRONMENT === "production"
        })
        return res.status(200).json({existUser})
    }catch(error){
        return res.status(500).json({Message: "Internal Server Error"})
    }
}

export const LogOut = async(req, res) =>{
    try{
        res.clearCookie("token");
        res.status(200).json({message: "log out successfully"})
    }catch(error){
         return res.status(500).json({Message: "Internal Server Error"})
    }
}