import React, { useMemo, useRef, useState } from "react";
import { useInterview } from "../hooks/useinterview.js";
import { useNavigate } from "react-router";

const Home = () => {

  const { loading, generateReport, reports } = useInterview();

  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const fileInputRef = useRef(null);

  const jobDescriptionCount = useMemo(() => jobDescription.length, [jobDescription]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleGenerateReport = async () => {
    const data = await generateReport({ resumeFile, jobDescription, selfDescription });
    navigate(`/interview/report/${data._id}`);
  }

  if(loading){
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#090b12] text-white px-4 py-10">
        <div className="w-full max-w-7xl h-[calc(100vh-2.5rem)] bg-zinc-900/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex items-center justify-center">
          <span className="text-xl text-zinc-400">Generating your personalized interview strategy...</span>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="w-full h-screen flex items-center justify-center bg-[#090b12] text-white px-4 overflow-hidden">
      <div className="w-full max-w-6xl h-[calc(100vh-2rem)] bg-zinc-900/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 h-full overflow-hidden">
          <div className="space-y-6 h-full overflow-hidden">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Create Your Custom <span className="text-fuchsia-400">Interview Plan</span>
              </h1>
              <p className="mt-2 text-sm text-zinc-300">
                Let our AI analyze the job requirements and your unique profile to build a winning strategy.
              </p>
            </div>

            <div className="flex flex-col h-full rounded-2xl bg-zinc-800/80 border border-zinc-700 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">Target Job Description</h2>
                  <p className="text-xs text-zinc-400 mt-1">Paste the full job description here.</p>
                </div>
                <span className="text-xs text-zinc-400">
                  {jobDescriptionCount}/5000
                </span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                className="mt-4 w-full h-full min-h-45 max-h-90 rounded-xl bg-zinc-950/40 border border-zinc-700 p-4 text-sm outline-none placeholder:text-zinc-500 focus:border-fuchsia-400 resize-none"
              />
            </div>
          </div>

          <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col flex-1 min-h-0 rounded-2xl bg-zinc-800/80 border border-zinc-700 p-6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Your Profile</h2>
                <span className="text-xs text-zinc-400">BEST RESULTS</span>
              </div>

              <div className="mt-4 flex-1 min-h-0 overflow-auto pr-2">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-950/30 px-5 py-10 text-center hover:border-fuchsia-400 transition"
                >
                  <div className="space-y-1">
                    <div className="text-2xl">📄</div>
                    <p className="text-sm font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-zinc-400">PDF or DOCX (Max 5MB)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-md bg-fuchsia-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-400"
                  >
                    Upload Resume
                  </button>

                  <p className="text-xs text-zinc-400">OR</p>

                  {resumeFile ? (
                    <div className="rounded-xl bg-zinc-900/50 px-3 py-2 text-xs text-zinc-200">
                      {resumeFile.name} • {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500">No file selected</div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="selfDescription" className="text-sm font-medium">
                    Quick Self-Description
                  </label>
                  <textarea
                    id="selfDescription"
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                    className="mt-2 w-full h-25 rounded-xl bg-zinc-950/40 border border-zinc-700 p-4 text-sm outline-none placeholder:text-zinc-500 focus:border-fuchsia-400 resize-none"
                  />
                </div>

                <div className="mt-4 rounded-xl bg-zinc-950/40 px-4 py-3 text-xs text-zinc-400">
                  Either a <span className="font-semibold text-white">Resume</span> or a <span className="font-semibold text-white">Self Description</span> is required to generate a personalized plan.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateReport}
              className="w-full rounded-2xl bg-fuchsia-500 px-6 py-4 text-lg font-semibold text-black shadow-lg shadow-fuchsia-500/30 transition hover:bg-fuchsia-400"
            >
              Generate My Interview Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-[#090b12] p-4">
      { reports && reports.length > 0 && (
        <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-zinc-900/80 rounded-2xl border border-zinc-700">
          <h2 className="text-xl font-semibold text-white mb-4">Your Past Interview Reports</h2>
          <ul className="space-y-3">  
            {reports.map((report) => (
              <li key={report._id} className="flex items-center justify-between cursor-pointer rounded-lg bg-zinc-800/80 border border-zinc-700 p-4 hover:bg-zinc-800/90 transition">
                <div>

                  <div className="text-sm font-medium text-white">{report.title || "Untitled Report"}</div>
                  <div className="text-xs text-zinc-400">{new Date(report.createdAt).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => navigate(`/interview/report/${report._id}`)}
                  className="text-sm font-medium cursor-pointer text-fuchsia-400 hover:text-fuchsia-300 transition"
                >
                  View Report
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
};

export default Home;
