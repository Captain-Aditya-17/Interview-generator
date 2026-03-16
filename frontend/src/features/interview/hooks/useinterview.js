import * as interviewService from '../services/interview.api.js'
import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { InterviewContext } from '../Interview.context.jsx'
import { useParams } from 'react-router'

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams();

    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider')
    }
    const { loading, setloading, report, setReport, reports, setReports } = context

    const generateReport = async ({ resumeFile, jobDescription, selfDescription }) => {
        setloading(true)
        let response = null
        try {
            response = await interviewService.generateInterviewReport({ resumeFile, jobDescription, selfDescription })
            setReport(response.interviewReport)
        } catch (error) {
            console.error('Error generating report:', error)
        } finally {
            setloading(false)
        }

        return response.interviewReport
    }
    const getReportById = async (interviewId) => {
        setloading(true)
        let response = null
        try {
            response = await interviewService.getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.error('Error fetching report:', error)
        } finally {
            setloading(false)
        }

        return response.interviewReport
    }
    const getAllReports = async () => {
        setloading(true)
        let response = null
        try {
            response = await interviewService.getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
        return response.interviewReports
    }

    const generateResumePdf = async (interviewId) => {
        setloading(true)
        let response = null
        try {
            response = await interviewService.generateResumePdf(interviewId)
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `resume_${interviewId}.pdf`)
            document.body.appendChild(link)
            link.click()
        } catch (error) {
            console.error('Error generating PDF:', error)
        } finally {            setloading(false)
        }
    }
    
      useEffect(()=>{
        if(interviewId){
          getReportById(interviewId)
        } else{
            getAllReports();
        }
      },[interviewId])

    return { loading, report, reports, generateReport, getReportById, getAllReports, generateResumePdf }
}
