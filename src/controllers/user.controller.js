import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadonCloudinary} from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessTokenandRefreshToken=async (userId)=>{
    //generate access token and refresh token
    try {
        const user=await User.findById(userId)
        if(!user){
            throw new ApiError("User not found",404)
        }
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()
        user.refreshToken=refreshToken
        
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError("Error generating tokens",500)
        
    }
}

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
    const existedUser=await User.findOne({
        $or: [{userName},{email}]
    })
    

    if(existedUser){
        throw new ApiError("user with this email or username already exists",409)
    }


    //handling image files
    const avatarLocalPath=req.files?.avatar[0]?.path
    // const coverImageLocalPath=req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError("Avatar file is required!!",400)
    }

    //upload files on cloudinary
    const avatar=await uploadonCloudinary(avatarLocalPath)
    const coverImage=await uploadonCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("Avatar file is required!!",400)
    }


    //create user object and entry in db

    const user=await User.create({
        fullName,
        avatar:avatar.secure_url,
        coverImage:coverImage?.secure_url || "",
        password,
        email,
        userName:userName.toLowerCase()
    })

    //check if user was created
    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError("Something went wrong while registering the user",500)
    }

    //return response

    return res.status(201).json(
        new ApiResponse(200,"User is registered successfully",createdUser)
    )







})



const loginUser= asyncHandler(async (req,res)=>{

    const{email,userName,password}=req.body
    if(!userName && !email){
        throw new ApiError("Username or email is required",400)
    }

    const user=await User.findOne({
        $or:[{userName},{email}]
    })

    if(!user){
        throw new ApiError("User does not exist",400)
    }

    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError("Invalid user credentials",401)
    }

    const {accessToken,refreshToken}=await generateAccessTokenandRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    // Set cookies for refreshToken and accessToken
    const options={
        httpOnly:true,
        secure:true,
        sameSite: "strict"
    }

    // The use of cookies here is to securely store the refreshToken and accessToken on the client side.
    // httpOnly ensures the cookies are not accessible via JavaScript (helps prevent XSS attacks).
    // secure ensures cookies are sent only over HTTPS.
    // sameSite: "strict" helps prevent CSRF attacks.

    return res
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .status(200)
        .json(
            new ApiResponse(200,"User logged in successfully",{
                user:loggedInUser,
                accessToken,
                refreshToken
            }
        )
        )

})


const logoutUser=asyncHandler(async (req,res)=>{
    const userId=req.user._id

    //find user and update refreshToken to null
    const user=await User.findByIdAndUpdate(userId,{
        refreshToken:null
    },{
        new:true,
        runValidators:true
    })

    if(!user){
        throw new ApiError("User not found",404)
    }

    const options={
        httpOnly:true,
        secure:true,
        sameSite: "strict"
    }
    //clear cookies
    return res
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .status(200)
        .json(
            new ApiResponse(200,"User logged out successfully")
        )
    
})

const refreshAccessToken= asyncHandler(async (req,res)=>{
    incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError("Unauthorized Request",401)
    }
    decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    if(!decodedToken){
        throw new ApiError("Unauthorized Request",401)
    }

    user=await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError("Invalid Refresh Token",401)
    }

    if(incomingRefreshToken!==user?.refreshToken){
        throw new ApiError("Invalid Refresh Token",401)
    }

    const {accessToken,refreshToken}=await generateAccessTokenandRefreshToken(user._id)

    return res
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .status(200)
        .json(
            new ApiResponse(200,"Access token refreshed successfully",{
                user,
                accessToken,
                refreshToken
            })
        )

})

const updatePassword=asyncHandler(async (req,res)=>{
    const {currentPassword,newPassword}=req.body
    if(!currentPassword || !newPassword){
        throw new ApiError("Current password and new password are required",400)
    }

    const userId=req.user._id
    const user=await User.findById(userId)

    if(!user){
        throw new ApiError("User not found",404)
    }

    const isPasswordValid=await user.isPasswordCorrect(currentPassword)
    if(!isPasswordValid){
        throw new ApiError("Invalid current password",401)
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(200,"Password updated successfully")
    )
})


const getCurrentUser=asyncHandler(async (req,res)=>{
    return res.status(200).json(
        new ApiResponse(200,"Current user fetched successfully",req.user)
    )
})

const updateAccountDetails=asyncHandler(async (req,res)=>{
    const {fullName,userName,email}=req.body
    if([fullName,userName,email].some((field)=>
    field?.trim()==="")
    ){
        throw new ApiError("All Fields are Necessary",400)

    }

    const userId=req.user._id

    await User.findByIdAndUpdate(userId,{
        fullName,
        userName:userName.toLowerCase(),
        email:email.toLowerCase()
    },{
        new:true,
        runValidators:true
    }).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,"User details updated successfully",user)
    )
})

const updateUserAvatar=asyncHandler(async (req,res)=>{
    const userId=req.user._id
    const avatarLocalPath=req.file?.path

    if(!avatarLocalPath){
        throw new ApiError("Avatar file is missing!!",400)
    }

    //upload files on cloudinary
    const avatar=await uploadonCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError("Error in uploading file on cloudinary!!",400)
    }

    //update user avatar in db
    const user=await User.findByIdAndUpdate(userId,{
        avatar:avatar.secure_url
    },{
        new:true,
        runValidators:true
    }).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,"User avatar updated successfully",user)
    )
})

const updateUserCoverImage=asyncHandler(async (req,res)=>{
    const userId=req.user._id
    const coverImageLocalPath=req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError("Cover image file is missing!!",400)
    }

    //upload files on cloudinary
    const coverImage=await uploadonCloudinary(coverImageLocalPath)

    if(!coverImage){
        throw new ApiError("Error in uploading file on cloudinary!!",400)
    }

    //update user cover image in db
    const user=await User.findByIdAndUpdate(userId,{
        coverImage:coverImage.secure_url
    },{
        new:true,
        runValidators:true
    }).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,"User cover image updated successfully",user)
    )
})

const getUserChannelProfile=asyncHandler(async (req,res)=>{
    const {userName}=req.params

    if(!userName?.trim){
        throw new ApiError("User Name is required",400)
    }


    const channel=User.aggregate([
        {
            $match: {
                userName:userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "Subscriber"
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "user",
                as: "Subscriptions"
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$Subscriber" },
                subscriptionCount: { $size: "$Subscriptions" },
                isSubscribed: {
                    $cond: {
                        if: { $in : [req.user?._id, "$Subscriber.user"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                subscriptionCount: 1,
                isSubscribed: 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError("Channel not found",404)
    }

    return res.status(200).json(
        new ApiResponse(200,"Channel profile fetched successfully",channel[0])
    )

})

const getWatchHistory=asyncHandler(async (req,res)=>{
    const user=await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "Video",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "User",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            "owner": { $arrayElemAt: ["$owner", 0] }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                watchHistoryVideos: 1
            }
        }
    ])

    res.status(200).json(
        new ApiResponse(200,"Watch history fetched successfully",user[0]?.watchHistory || [])
    )
})

export{registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,updatePassword,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory}