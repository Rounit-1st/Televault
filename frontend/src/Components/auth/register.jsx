import { useState } from "react";

export default function Register({switchMode}){
    const [loading, setLoading] = useState(false);

    return (
        <form action="" className="flex flex-col items-center m-4 p-4 sm:m-16 sm:p-16 border rounded-4xl h-fit">
            <label htmlFor="" className="text-2xl font-extrabold m-4 text-center">Register</label>
            <input type="email" name="inputMail" id="" placeholder="Your Email ID" className="bg-white w-3/4 h-16 p-8 lg:p-4 lg:px-16 m-4 border rounded-4xl"/>
            <input type="password" name="password" id="" placeholder="Password" className="bg-white w-3/4 h-16 p-8 lg:p-4 lg:px-16 m-4 border rounded-4xl"/>
            <input type="password" name="confirmpassword" id="" placeholder="Confirm Password" className="bg-white w-3/4 h-16 p-8 lg:p-4 lg:px-16 m-4 border rounded-4xl"/>
            <button type="submit" className="bg-blue-400 rounded-4xl p-4 px-12 m-4 text-white cursor-pointer"
                onClick={()=>{ 
                    setLoading(true);
                }}
            >{loading ? 'Loading ...': 'Sign In'}
            </button>
            <span className="underline cursor-pointer" onClick={()=>{switchMode('Login');}}>Login</span>
            {/* <span className="red-500">{errorMessage}</span> */}
        </form>
    )
}