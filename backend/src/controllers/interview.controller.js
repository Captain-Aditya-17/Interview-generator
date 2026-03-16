import interviewReportModel from '../models/interviewReport.model.js'
import {generateInterviewReport,generateResumePdf} from '../services/ai.service.js'

export const generateInterviewReportController = async (req,res)=>{
    const { PDFParse } = await import("pdf-parse");

    const parser = new PDFParse({ data: Uint8Array.from(req.file.buffer) });
    const pdfData = await parser.getText();
    await parser.destroy();

    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: pdfData.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: pdfData.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(200).json({
        message: "interview Report generated",
        interviewReport
    })
}

export const getInterviewReportController =  async (req,res)=>{
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({_id: interviewId , user: req.user.id})

    if(!interviewReport){
        return res.status(404).json({ message: "Interview report not found" })
    }
    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

export const getAllInterviewReportsController = async (req,res)=>{
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    })
}

export const generateResumePdfController = async (req,res)=>{
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewId)

    if(!interviewReport){
        return res.status(404).json({ message: "Interview report not found" })
    }

    const {resume, jobDescription, selfDescription} = interviewReport

    const pdfBUffer = await generateResumePdf({resume, jobDescription, selfDescription})

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=resume_${interviewId}.pdf`,
    })

    res.send(pdfBUffer)
}