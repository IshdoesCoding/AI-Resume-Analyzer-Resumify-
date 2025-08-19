import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import {resumes} from "../../Constants";
import ResumeCard from "../components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect, useRef} from "react";


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
  // Use debounce to prevent rapid redirects when WebSocket connection is suspended
  const redirectTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clear any existing timeout
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    
    // Only redirect if not authenticated, but add a delay to prevent rapid redirects
    if (auth.isAuthenticated === false) {
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate('/auth?next=/');
      }, 500); // 500ms debounce
    }
    
    // Cleanup on unmount
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [auth.isAuthenticated, navigate])


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
