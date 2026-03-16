import React, { useMemo, useState, useEffect } from "react";
import { useInterview } from "../hooks/useinterview.js";
import { useNavigate , useParams } from "react-router";



const tabs = [
  { id: "technical", label: "Technical questions" },
  { id: "behavioral", label: "Behavioral questions" },
  { id: "roadmap", label: "Road Map" },
];

const severityColor = {
  Low: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  Medium: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  High: "bg-rose-500/20 text-rose-200 border-rose-500/40",
};

const Interview = () => {

  const {loading, report, getReportById , generateResumePdf} = useInterview();
  const navigate = useNavigate();
  const { interviewId } = useParams();

  const [activeTab, setActiveTab] = useState("technical");

 useEffect(()=>{
    if(interviewId){
      getReportById(interviewId)
    } 
  },[interviewId])

  const content = useMemo(() => {
    if (!report) return [];

    if (activeTab === "technical") {
      return report.technicalQuestions;
    }
    if (activeTab === "behavioral") {
      return report.behavioralQuestions;
    }
    return report.preparationPlan;
  }, [activeTab, report]);

  if(loading || !report){
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#090b12] text-white px-4 py-10">
        <span className="text-xl text-zinc-400">
          Loading your interview report...
        </span>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#090b12] text-white px-4 py-10">
      <div className="w-full max-w-7xl h-[calc(100vh-2.5rem)] bg-zinc-900/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-4 p-6">
          {/* Sidebar */}
          <aside className="flex flex-col rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">Sections</h2>
              <span className="text-xs text-zinc-400">Score: {report.matchScore}</span>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left rounded-xl px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-fuchsia-500/30 text-fuchsia-100"
                      : "bg-white/5 text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-700">
              <button
                type="button"
                onClick={() => {generateResumePdf(interviewId)}}
                className="w-full rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-semibold text-white hover:bg-fuchsia-400 transition"
              >
                Download as PDF
              </button>
              <p className="mt-2 text-[11px] text-zinc-400">
                Produces a printable PDF via browser print dialog.
              </p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex flex-col rounded-2xl border border-zinc-700 bg-zinc-950/40 p-6 overflow-hidden">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  {activeTab === "roadmap" ? "Road Map" : "Interview Prep"}
                </h1>
                <p className="mt-1 text-xs text-zinc-400">
                  {activeTab === "technical" && "Review the top technical questions you should prepare for."}
                  {activeTab === "behavioral" && "Prepare your strongest stories with clear intent and outcome."}
                  {activeTab === "roadmap" && "Use this three-day plan to focus your weekly practice."}
                </p>
              </div>
              {activeTab !== "roadmap" && (
                <div className="rounded-full bg-zinc-900/40 px-4 py-2 text-xs font-semibold text-zinc-100">
                  {activeTab === "technical" && "Tech Ready"}
                  {activeTab === "behavioral" && "Behavioral Ready"}
                </div>
              )}
            </header>

            <div className="mt-6 flex-1 min-h-0 overflow-auto pr-2 no-scrollbar">
              {activeTab === "roadmap" ? (
                <div className="space-y-4">
                  {content.map((day) => (
                    <div
                      key={day.day}
                      className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-zinc-200">Day {day.day}</div>
                          <div className="text-xs text-zinc-400">{day.focus}</div>
                        </div>
                        <div className="text-xs font-semibold text-zinc-300">{day.tasks.length} tasks</div>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-zinc-200">
                        {day.tasks.map((task) => (
                          <li key={task} className="flex gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {content.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-zinc-100">{item.question}</div>
                          <div className="mt-2 text-xs text-zinc-400">{item.intention}</div>
                        </div>
                        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-200">
                          {activeTab === "technical" ? "Tech" : "Behavioral"}
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-zinc-950/40 p-4 text-sm leading-relaxed text-zinc-200">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Skill gaps */}
          <aside className="flex flex-col rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">Skill Gaps</h2>
              <span className="text-xs text-zinc-400">Priorities</span>
            </div>

            <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl bg-zinc-950/40 p-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500/20 via-fuchsia-500/10 to-transparent">
                <div className="absolute inset-1 rounded-full border border-white/15" />
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-950/80">
                  <span className="text-2xl font-semibold text-white">{report.matchScore}%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Match Score
                </div>
                <div className="mt-1 text-sm font-semibold text-emerald-200">
                  {report.matchScore >= 85
                    ? "Strong match for this role"
                    : report.matchScore >= 65
                    ? "Good match with room to improve"
                    : "Consider strengthening key areas"}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {report.skillGaps.map((gap) => (
                <div
                  key={gap.skill}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${
                    severityColor[gap.severity] ?? severityColor.Medium
                  }`}
                >
                  <span className="line-clamp-1">{gap.skill}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide">
                    {gap.severity}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Interview;
