import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
})

export const generateInterviewReport = async ({resumeFile, selfDescription, jobDescription})=>{
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await api.post('/interview', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })

    return response.data
}

export const getInterviewReportById = async (interviewId)=>{
    const response = await api.get(`/interview/report/${interviewId}`)
    return response.data
}

export const getAllInterviewReports = async ()=>{

    
    const response = await api.get('/interview')
    return response.data
}

export const generateResumePdf = async (interviewId)=>{
    const response = await api.get(`/interview/resume/pdf/${interviewId}` ,{
        responseType: "blob"
    })
    return response.data
}