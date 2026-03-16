import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import puppeteer from "puppeteer";

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
    });

    const reportSchema = {
        description: "Interview preparation report",
        type: SchemaType.OBJECT,
        properties: {
            matchScore: {
                type: SchemaType.NUMBER,
                description: "Score between 0 and 100"
            },
            technicalQuestions: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        question: { type: SchemaType.STRING },
                        intention: { type: SchemaType.STRING },
                        answer: { type: SchemaType.STRING },
                    },
                    required: ["question", "intention", "answer"],
                },
            },
            behavioralQuestions: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        question: { type: SchemaType.STRING },
                        intention: { type: SchemaType.STRING },
                        answer: { type: SchemaType.STRING },
                    },
                    required: ["question", "intention", "answer"],
                },
            },
            skillGaps: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        skill: { type: SchemaType.STRING },
                        severity: { type: SchemaType.STRING, enum: ["low", "medium", "high"] },
                    },
                    required: ["skill", "severity"],
                },
            },
            preparationPlan: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        day: { type: SchemaType.NUMBER },
                        focus: { type: SchemaType.STRING },
                        tasks: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                        },
                    },
                    required: ["day", "focus", "tasks"],
                },
            },
            title: { type: SchemaType.STRING },
        },
        required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
    };

    const prompt = `
        Analyze the candidate's details against the job requirements.
        Candidate Resume: ${resume}
        Candidate Self-Description: ${selfDescription}
        Target Job Description: ${jobDescription}

        Provide a structured interview report following the schema.
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: reportSchema,
            },
        });

        const response = result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error("Detailed AI Error:", error);
        throw error;
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" , margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" }});
    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
    });

    const resumeContentSchema = {
        description: "Structured resume content for PDF generation",
        type: SchemaType.OBJECT,
         properties: {
        htmlContent: {
            type: SchemaType.STRING,
            description: "HTML string for the resume"
        }
    },
    required: ["htmlContent"]

    }

    const prompt = `generate html structured resume for candidate based on the following information:
                    Candidate Resume: ${resume}
                    Candidate Self-Description: ${selfDescription}
                    Target Job Description: ${jobDescription}
                    
                    the response should be a JSON object with a single property "htmlContent" containing the HTML string for the resume which can be directly converted to PDF. The HTML should be well-structured and styled for a professional resume format.
                    the resume should include sections like Summary, Skills, Experience, and Education. Use the candidate's self-description to create a compelling summary and highlight relevant skills and experiences that match the job description. Ensure the HTML is clean and suitable for PDF conversion.
                    the resume should be tailored to the job description, emphasizing the most relevant information for the position. Avoid including any extraneous details that do not contribute to showcasing the candidate's suitability for the job.
                    the resume of the candidate should not sound like it was generated by AI, it should be natural and personalized based on the candidate's information provided. Focus on creating a resume that effectively represents the candidate's qualifications and aligns with the job requirements while maintaining a human touch in the language and presentation.
                    you can hightlight the skills and experience mentioned in the job description and match them with the candidate's resume and self-description to create a strong and relevant resume that stands out to recruiters.
                    `


    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: resumeContentSchema,
        },
    });

    const jsonContent = JSON.parse(result.response.text());

    const pdfBuffer = await generatePdfFromHtml(jsonContent.htmlContent);
    return pdfBuffer;
}


export {generateInterviewReport, generateResumePdf}