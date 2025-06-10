import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.models.js"
import uploadonCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"


const registerUser=asyncHandler(async (req,res)=>{
    //get user details from frontend
    const {fullName,email,userName,password}=req.body


    //validation 
    if([fullName,email,userName,password].some((field)=>
    field?.trim()==="")
    ){
        throw new ApiError("All Fields are Necessary",400)

    }

    //Check is user already exists
    const existedUser=User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError("user with this email or username already exists",409)
    }


    //handling image files
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError("Avatar file is required!!",400)
    }

    //upload files on cloudinary
    avatar=uploadonCloudinary(avatarLocalPath)
    coverImage=uploadonCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("Avatar file is required!!",400)
    }


    //create user object and entry in db

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password,
        email,
        userName:userName.toLowerCase()
    })

    //check if user was created
    const createdUser=User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError("Something went wrong while registering the user",500)
    }

    //return response

    return res.status(201).json(
        new ApiResponse(200,"User is registered successfully",createdUser)
    )







})


export{registerUser}