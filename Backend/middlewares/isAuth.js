import jwt from "jsonwebtoken";

export const isauth = async (req, res, next)=>{
   try{
        let {token} = await req.cookies;
        if(!token){
            return res.status(400).json({message: "user does not have token"});
        }
        let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyToken){
            return res.status(400).json({message: "user does not have valid token"});
        }
        req.userId = verifyToken.userid;
        next();
   }catch(error){
    console.log(error);
    return res.status(500).json({message: "is auth error"});
   }
}

