import { useState } from "react";
import Login from "./auth/login";
import Register from "./auth/register";

export default function Hero() {
    const [mode, setMode] = useState("Login");
    const [errorMessage, setErrorMessage] = useState("");

    async function credential_sender() {
        const URL = import.meta.env.VITE_BACKEND_URL;

        try {
            const res = await fetch(URL, {
                method: "POST",
                body: JSON.stringify({}),
            });

            const data = await res.json();

            if (!data.success) {
                setErrorMessage(data.message);
            }
        } catch (err) {
            setErrorMessage("Something went wrong.");
        }
    }

    return (
        <section className="relative overflow-hidden min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">
            {/* Background Blur */}
            <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-16 px-6 lg:px-12 py-20">

                {/* Left Side */}
                <div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                        🚀 Powered by Telegram Cloud
                    </span>

                    <h1 className="mt-6 text-5xl lg:text-6xl font-black leading-tight text-gray-900">
                        Store your files
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            without paying
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg text-gray-600 leading-8">
                        Televault transforms Telegram into your own secure cloud
                        drive. Upload, organize, preview and access your files
                        anywhere with an elegant and lightning-fast interface.
                    </p>

                    <div className="mt-10 flex gap-4 flex-wrap">
                        <button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-semibold text-white shadow-lg hover:scale-105 transition duration-300">
                            Get Started
                        </button>

                        <a
                            href={import.meta.env.VITE_learnMoreURL}
                            className="rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold text-gray-700 hover:bg-gray-100 transition"
                        >
                            Learn More
                        </a>
                    </div>

                    <div className="mt-12 flex gap-8 text-sm text-gray-500">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                Unlimited*
                            </p>
                            <p>Telegram Storage</p>
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                Encrypted
                            </p>
                            <p>Client Side Encryption</p>
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                Fast
                            </p>
                            <p>Instant Uploads</p>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="relative flex justify-center">

                    {/* Floating Image */}
                    <img
                        src="HeroImg.jpeg"
                        alt="Hero"
                        className="absolute -left-40 top-12 hidden xl:block w-64 rounded-3xl shadow-2xl rotate-[-20deg] hover:rotate-0 transition duration-500"
                    />

                    {/* Login Card */}
                    <div className="w-full max-w-xl rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl p-2">

                        {errorMessage && (
                            <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
                                {errorMessage}
                            </div>
                        )}

                        {mode === "Login" ? (
                            <Login switchMode={setMode} />
                        ) : (
                            <Register switchMode={setMode} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}