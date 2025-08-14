import React from 'react';
import Navbar from "~/components/Navbar";
import {useState} from "react";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/format";
import {prepareInstructions} from "../../Constants";

const Upload = () =>{
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null)

    // function to deal with file select
    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    // helps analyze the details
    const handleAnalyze = async({companyName, jobTitle, jobDescription, file} : {companyName: string, jobTitle: string, jobDescription: string, file: File}) =>{
        setIsProcessing(true);
        setStatusText('uploading the file...');

        const uploadedFile = await fs.upload([file])
        if (!uploadedFile) return setStatusText('Error: Failed to upload');

        setStatusText('Converting to Image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile) return setStatusText('Failed to convert pdf to image');

        setStatusText('Uploading image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Error: Failed to upload');

        setStatusText('Preparing data...');

        const uuid = generateUUID();

        // data object
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName: companyName,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            feedback: '',
        }

        //each resume will have its own unique uuid
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analyse Complete, redirecting...');

        console.log(data);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if(!file) return;

        handleAnalyze( {companyName,jobTitle, jobDescription, file})

    }

    return (
        <main className = "bg-[url('/images/bg-main.svg')] bg-cover ">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1> In-depth AI feedback tailored to your specific job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />

                        </>
                    ):(
                        <h2> Upload your resume for an ATS Score and tips for improvement</h2>
                    )
                    }
                    {!isProcessing ? (
                        <form id= "upload-form" onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name"> Company Name</label>
                                <input type="text" name="company-name" placeholder="Enter Your Company Name"  id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title"> Job Title</label>
                                <input type="text" name="job-title" placeholder="Enter Your Job Title"  id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description"> Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Enter Your Job Description"  id="job-description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader"> Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />

                                <button className="primary-button" type="submit"> Analyze Resume</button>
                            </div>

                        </form>
                    ):null
                    }
                </div>

            </section>
        </main>
    )
}

export default Upload;