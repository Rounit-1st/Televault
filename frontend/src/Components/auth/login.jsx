import { useState } from "react";
import { sendLoginCredential } from "../../api/auth_api";
import { useNavigate } from "react-router-dom";

export default function Login({ switchMode }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await sendLoginCredential({
                email: e.target.inputMail.value,
                password: e.target.password.value,
            });

            const resData = await res.json();

            if (!res.ok) {
                throw new Error(resData.message || "Something went wrong");
            }

            if (resData.success === true) {
                setSuccess("✅ Logged in successfully!");

                setTimeout(() => {
                    navigate("/filemanage?path=/");
                }, 1000);
            } else {
                setError(resData.message);
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center m-4 p-4 sm:m-16 sm:p-16 border rounded-4xl h-fit"
        >
            <label className="text-2xl font-extrabold m-4 text-center">
                Login
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

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-400 rounded-4xl p-4 px-12 m-4 text-white cursor-pointer disabled:opacity-50"
            >
                {loading ? "loading..." : "Login"}
            </button>

            <span
                className="underline cursor-pointer"
                onClick={() => switchMode("Register")}
            >
                Register
            </span>

            {error && <span className="text-red-500">{error}</span>}
            {success && <span className="text-green-500">{success}</span>}
        </form>
    );
}