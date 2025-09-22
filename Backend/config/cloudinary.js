import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
const uploadOnCloudinary = async (filepath) =>{
      cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_CLOUD_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    try {
        if(!filepath){
            return null;
        }
        const upload = await cloudinary.uploader.upload(filepath);
        fs.unlinkSync(filepath);
        return upload.secure_url;
    } catch (error) {
        fs.unlinkSync(filepath);
        console.log(error);
    }
}

export default uploadOnCloudinary;