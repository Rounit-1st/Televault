export default function Navbar(){
    return (
        <div className="bg-gray-200 border h-20 px-4 md:px-8 lg:px-24 flex align-middle ">
                <img src="televaultLogo.png" className="p-2" alt="logo" />
                <div className="flex justify-end w-full text-center p-1">
                    <a className="p-6 cursor-pointer" href={import.meta.env.VITE_learnMoreURL}>Learn more</a>
                </div>
        </div>
    )
}