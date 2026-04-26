export default function Navbar() {
    return (
        <div className="bg-gray-200 border h-20 px-4 md:px-8 lg:px-24 flex items-center">
            <a href="/" className="flex items-center">
                <img
                    src="televaultLogo.png"
                    className="h-14 w-auto object-contain"
                    alt="logo"
                />
            </a>

            <div className="flex justify-end w-full text-center">
                <a
                    className="p-6 cursor-pointer"
                    href={import.meta.env.VITE_learnMoreURL}
                >
                    Learn more
                </a>
            </div>
        </div>
    );
}