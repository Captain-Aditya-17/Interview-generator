import express from 'express'
const interviewRouter = express.Router()
import { authUser } from '../middleware/auth.middleware.js'
import upload from '../middleware/file.middleware.js'
import * as interviewController from '../controllers/interview.controller.js'

interviewRouter.post('/',authUser, upload.single("resume"), interviewController.generateInterviewReportController)
interviewRouter.get('/report/:interviewId', authUser, interviewController.getInterviewReportController)    
interviewRouter.get('/', authUser, interviewController.getAllInterviewReportsController)
interviewRouter.get('/resume/pdf/:interviewId', authUser, interviewController.generateResumePdfController)

export default interviewRouter