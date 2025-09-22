import jwt from 'jsonwebtoken';


const getToken = async(userid)=>{
    try{
        let token = jwt.sign({userid},process.env.JWT_SECRET,{expiresIn:'7d'})
        return token;
    }catch(error){
        console.log(error);
    }
}

export default getToken