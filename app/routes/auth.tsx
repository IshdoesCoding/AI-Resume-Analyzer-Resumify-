import React from 'react'
import {useLocation,useNavigate} from "react-router";
import {useEffect, useRef} from "react";
import {usePuterStore} from "~/lib/puter";

export const meta = () => ([
    {title: 'Resumify | Auth'},
    {name: 'description',content: 'Log into your account.'},
])

const Auth: () =>  React.JSX.Element = () => {

    // variables that store function used for state and redirection
    const {isLoading, auth} = usePuterStore()
    const location = useLocation()
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();


    // helps with redirection, if auth successful, redirect to the next page, if not keep them here
    // Use debounce to prevent rapid redirects when WebSocket connection is suspended
    const redirectTimeoutRef = useRef<number | null>(null);
    
    // Log authentication state changes
    useEffect(() => {
        console.log("Auth component - Auth state changed:", { 
            isAuthenticated: auth.isAuthenticated, 
            isLoading, 
            next: next || '/' 
        });
    }, [auth.isAuthenticated, isLoading, next]);
    
    useEffect(() => {
        // Clear any existing timeout
        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
            redirectTimeoutRef.current = null;
        }
        
        console.log("Auth component - Checking redirect conditions:", { 
            isAuthenticated: auth.isAuthenticated, 
            isLoading, 
            next: next || '/' 
        });
        
        // Only redirect if authenticated, not loading, and there's a 'next' parameter
        // This prevents redirection when a user is intentionally on the auth page to log out
        if (auth.isAuthenticated && !isLoading && next) {
            console.log("Auth component - Setting up redirect to:", next);
            redirectTimeoutRef.current = window.setTimeout(() => {
                console.log("Auth component - Executing redirect to:", next);
                navigate(next);
            }, 500); // 500ms debounce
        }
        
        // Cleanup on unmount
        return () => {
            if (redirectTimeoutRef.current) {
                console.log("Auth component - Clearing redirect timeout");
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, [auth.isAuthenticated, isLoading, next, navigate])


    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex item-center justify-center">

            <div className={"gradient-border shadow-lg"}>

                <section className="flex flex-col  gap-8 bg-white rounded-2xl p-10">

                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Hello Again!</h1>
                        <h2>Log In to Perfect Your Resume</h2>
                    </div>

                    <div>
                        {isLoading ? (
                            <button className={"auth-button animate-pulse"}>  Signing in...</button>
                        ): (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p> Log Out </p>
                                    </button>
                                ) :(
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <p> Log In </p>
                                    </button>
                                )}
                            </>
                        )
                        }
                    </div>

                </section>


            </div>

        </main>
    )
}

export default Auth;