export default function Hero(){
    return(
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <div className=" flex flex-col">
                <h1 className="m-12 font-extrabold text-gray-800 text-4xl">Secure and simple to use cloud storage for your <span className="text-blue-400 block">cool</span></h1>
                <img src="HeroImg.jpeg" className="h-100 mx-16" alt="" />
            </div>
            <div className="flex w-full flex-col justify-center ">
                <form action="" className="flex flex-col items-center m-4 p-4 sm:m-16 sm:p-16 border rounded-4xl h-fit">
                    <label htmlFor="" className="text-2xl font-bold m-4 text-center">Login or Sign Up Now</label>
                    <input type="email" name="inputMail" id="" placeholder="Your Email ID" className="bg-white w-3/4 h-16 p-2 lg:p-4 lg:px-16 m-4 border rounded-4xl"/>
                    <button type="submit" className="bg-blue-400 rounded-4xl p-4 px-12 m-4 text-white cursor-pointer">Login</button>
                    or
                    <button className="border rounded-4xl m-4 p-4">Sign up with Google</button>
                </form>
            </div>
        </section>
    )
}