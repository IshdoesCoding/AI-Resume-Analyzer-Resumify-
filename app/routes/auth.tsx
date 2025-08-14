import React from 'react'
import {useLocation,useNavigate} from "react-router";
import {useEffect} from "react";
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
    useEffect(()=> {
        if(auth.isAuthenticated) navigate(next);
    },[auth.isAuthenticated,next])


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