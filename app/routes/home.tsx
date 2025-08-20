import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "../components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate, Link} from "react-router";
import {use, useEffect, useRef, useState} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumify" },
    { name: "description", content: "Tailored Resume for your dream jobs" },
  ];
}

export default function Home() {

  //variables that handles auth and navigation
  const {auth, kv} = usePuterStore()
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState<boolean>(false);

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

  useEffect(() => {
    const loadResumes = async() => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
          )
      )

      setResumes(parsedResumes || [])
      setLoadingResumes(false);
    }
    loadResumes();
  }, []);

  return <main className = "bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar />

    <section className= "main-section">
      <div className="page-heading py-16">
        <h1> Get Feedback on your Resume with Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2> No Resumes found. Upload your first resume to get feedback</h2>
        ):(
            <h2>Review your submissions and check AI-powered feedback </h2>
        )}
      </div>
      {loadingResumes && (
          <div className={"flex flex-col items-center justify-center"}>
            <img src="/images/resume-scan-2.gif" className="w-[200px]"/>
          </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}

    </section>

  </main>;
}
