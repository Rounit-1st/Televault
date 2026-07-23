import { Info} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200 shadow-sm">
            <nav className="max-w-7xl mx-auto h-20 px-6 lg:px-10 flex items-center justify-between">
                {/* Logo */}
                <a
                    href="/"
                    className="flex items-center gap-3 group"
                >
                    <img
                        src="televaultFavicon.png"
                        alt="Televault"
                        className="h-12 transition-transform duration-300 group-hover:scale-105"
                    />

                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent margin-left-20 ">
                            Televault
                        </h1>
                        <p className="text-xs text-gray-500 -mt-1">
                            Cloud Storage via Telegram
                        </p>
                    </div>
                </a>

                {/* Navigation */}
                <div className="flex items-center gap-4">
                    <a
                        href={import.meta.env.VITE_learnMoreURL}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    >
                        <Info size={18} />
                        Learn More
                    </a>

                    <a
                        href="https://github.com/Rounit-1st/Televault"
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-cyan-300/50 hover:scale-105 transition-all duration-300"
                    >
                        <FaGithub size={18} />
                        GitHub
                    </a>
                </div>
            </nav>
        </header>
    );
}