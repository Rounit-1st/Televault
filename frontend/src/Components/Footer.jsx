import {
    FaGithub,
    FaLinkedin,
    FaTelegramPlane,
    FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-14">

                <div className="grid md:grid-cols-3 gap-10">

                    {/* Logo */}
                    <div>
                        <img
                            src="televaultLogo.png"
                            alt="Televault"
                            className="h-14"
                        />

                        <h2 className="mt-4 text-3xl font-bold">
                            Televault
                        </h2>

                        <p className="mt-3 text-gray-400">
                            Your personal cloud storage powered by Telegram.
                            Fast, secure, and built for everyone.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-xl mb-4">
                            Quick Links
                        </h3>

                        <div className="flex flex-col gap-3 text-gray-400">
                            <a href="/" className="hover:text-cyan-400">
                                Home
                            </a>

                            <a
                                href="/learnMore"
                                className="hover:text-cyan-400"
                            >
                                Learn More
                            </a>

                            <a
                                href="https://github.com/Rounit-1st"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-cyan-400"
                            >
                                GitHub Repository
                            </a>
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="font-semibold text-xl mb-4">
                            Connect
                        </h3>

                        <div className="flex gap-5">

                            <a
                                href="https://github.com/Rounit-1st"
                                target="_blank"
                                rel="noreferrer"
                                className="h-12 w-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition duration-300 hover:scale-110"
                            >
                                <FaGithub size={24} />
                            </a>

                            <a
                                href="https://linkedin.in/in/rounit-kashyap"
                                target="_blank"
                                rel="noreferrer"
                                className="h-12 w-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition duration-300 hover:scale-110"
                            >
                                <FaLinkedin size={24} />
                            </a>

                            <a
                                href="https://t.me"
                                className="h-12 w-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition duration-300 hover:scale-110"
                            >
                                <FaTelegramPlane size={24} />
                            </a>

                            <a
                                href="mailto:your@email.com"
                                className="h-12 w-12 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition duration-300 hover:scale-110"
                            >
                                <FaEnvelope size={24} />
                            </a>

                        </div>
                    </div>

                </div>

                <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-400">
                    Made with ❤️ by <span className="text-white font-semibold">Rounit Kashyap</span>
                    <br />
                    © {new Date().getFullYear()} Televault. All rights reserved.
                </div>

            </div>
        </footer>
    );
}