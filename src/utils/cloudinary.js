import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { fileURLToPath } from 'url';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadonCloudinary=async (localfilePath) => {
    try {
        if(!localfilePath) return null
        const response= await cloudinary.uploader.upload(localfilePath,{
            resource_type: "auto"
        })
        fs.unlinkSync(localfilePath)
        console.log("file has been uploaded successfully",response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localfilePath)    //removes the locally saved file as upload operation got failed
        return null
        
        
    }

}
       


export{uploadonCloudinary}