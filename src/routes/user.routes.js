import {Router} from "express"
import { registerUser, updatePassword } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { loginUser, logoutUser,refreshAccessToken,updatePassword,getCurrentUser,
    updateAccountDetails,updateUserAvatar,getWatchHistory,updateUserCoverImage,getUserChannelProfile,registerUser } from "../controllers/user.controller.js"

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]

    ),
    registerUser)

// Routes for user authentication and account management 

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,updatePassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/watch-history").get(verifyJWT,getWatchHistory)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)





export default router