import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import {resumes} from "../../Constants";
import ResumeCard from "../components/ResumeCard";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumify" },
    { name: "description", content: "Tailored Resume for your dream jobs" },
  ];
}

export default function Home() {
  return <main className = "bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar />

    <section className= "main-section">
      <div className="page-heading py-16">
        <h1> Get Feedback on your Resume with Ratings</h1>
        <h2> review your submissions with AI-powered feedback </h2>
      </div>

      {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
                <ResumeCard key = {resume.id} resume = {resume} />
            ))}
          </div>
      )}

    </section>






  </main>;
}
