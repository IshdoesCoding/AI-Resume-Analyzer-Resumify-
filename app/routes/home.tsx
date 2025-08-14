import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import {resumes} from "../../Constants";
import ResumeCard from "../components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumify" },
    { name: "description", content: "Tailored Resume for your dream jobs" },
  ];
}

export default function Home() {

  //variables that handles auth and navigation
  const {auth} = usePuterStore()
  const navigate = useNavigate();


  // helps with redirection, if auth successful, redirect to the next page, if not keep them here
  useEffect(()=> {
    if(auth.isAuthenticated === false) navigate('/auth?next=/');
  },[auth.isAuthenticated,navigate])


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
