import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import { authUser } from '../middleware/auth.middleware.js'

const authRouter = express.Router()


authRouter.post("/register",  authController.register)
authRouter.post('/login', authController.login)
authRouter.get("/logout", authController.logout)
authRouter.get('/get-me', authUser, authController.getme)


export default authRouter