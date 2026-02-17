import { useState } from "react"
import Login from "./auth/login"
import Register from "./auth/register"

export default function Hero(){
    
    const [mode, setMode] = useState("Login")
    const [errorMessage, setErrorMessage] = useState("")


    async function credential_sender(){
    const URL = import.meta.env.VITE_BACKEND_URL
    try{
        res =await fetch(URL,{
            method: 'POST',
            body: JSON.stringify({})
        })
        if(res.sucess == false){
            setErrorMessage(res.message);
        }
    }catch(err){
        setErrorMessage(err.body)
    }
}

    return(
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <div className=" flex flex-col">
                <h1 className="m-12 font-extrabold text-gray-800 text-4xl">Secure and simple to use cloud storage for your <span className="text-blue-400 block">cool</span></h1>
                <img src="HeroImg.jpeg" className="h-100 mx-16" alt="" />
            </div>
            <div className="flex w-full flex-col justify-center ">
                {(mode==="Login")?<Login switchMode={setMode}/>:<Register switchMode={setMode}/>}
            </div>
        </section>
    )
}



