export default function Navbar(){
    return (
        <div className="bg-gray-200 border h-16 px-4 md:px-8 lg:px-24 flex align-middle ">
                <img src="vite.svg" className="py-2" alt="logo" />
                <div className="flex justify-end w-full text-center p-1">
                    <button className="bg-cyan-400 rounded-xl  px-4 m-2 text-md text-gray-100 font-bold hover:cursor-pointer ">Sign In</button>
                    <button className="bg-cyan-400 rounded-xl  px-4 m-2 text-md text-gray-100 font-bold hover:cursor-pointer ">Log In</button>
                </div>
        </div>
    )
}