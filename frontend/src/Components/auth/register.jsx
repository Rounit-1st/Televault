import { useState } from "react";
import { sendSignInCredential } from "../../api/auth_api";
import { useNavigate } from "react-router-dom";

export default function Register({ switchMode }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate(); // ✅ add this

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const email = e.target.inputMail.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmpassword.value;

        // ✅ password validation
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await sendSignInCredential({
                email,
                password,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }
            setSuccessMessage("✅ Registration successful!. Go to login.");

            console.log("Registered:", data);

            // ✅ redirect after success
            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (err) {
            setErrorMessage(err.message);
        }

        setLoading(false);
    }

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col items-center m-4 p-4 sm:m-16 sm:p-16 border rounded-4xl h-fit"
        >
            <label className="text-2xl font-extrabold m-4 text-center">
                Register
            </label>

            <input 
                type="email" 
                name="inputMail" 
                placeholder="Your Email ID"
                className="bg-white w-3/4 h-16 p-8 lg:p-4 lg:px-16 m-4 border rounded-4xl"
            />

            <input 
                type="password" 
                name="password" 
                placeholder="Password"
                className="bg-white w-3/4 h-16 p-8 lg:p-4 lg:px-16 m-4 border rounded-4xl"
            />

            <input 
                type="password" 
                name="confirmpassword" 
                placeholder="Confirm Password"
                className="bg-white w-3/4 h-16 p-8 lg:p-4 lg:px-16 m-4 border rounded-4xl"
            />

            <button 
                type="submit"
                disabled={loading}
                className="bg-blue-400 rounded-4xl p-4 px-12 m-4 text-white cursor-pointer disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Sign Up'}
            </button>

            <span 
                className="underline cursor-pointer" 
                onClick={() => switchMode('Login')}
            >
                Login
            </span>
            {successMessage && (
                <span className="text-green-500">{successMessage}</span>
            )}
            {errorMessage && (
                <span className="text-red-500">{errorMessage}</span>
            )}
        </form>
    );
}