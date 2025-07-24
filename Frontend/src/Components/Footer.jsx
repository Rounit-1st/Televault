export default function Footer(){
    return(
        <section className="h-fit bg-gray-800 text-white text-center text-xl p-4">
            Made with ❤️ 
            <label htmlFor="" className="block text-sm m-4">Reach out to Dev</label>
            <div className="flex">
                <a href=""><img src="" alt="" /><img src="" alt="" /><img src="" alt="" /></a>
            </div>
            <div className="socialLinks flex flex-rows justify-around p-4 mx-16 gap-8 md:mx-96">
               <a href=""><img src="vite.svg" className="h-16"  alt="" /></a>
               <a href=""><img src="vite.svg " className="h-16"  alt="" /></a>
               <a href=""><img src="vite.svg " className="h-16"  alt="" /></a>
               <a href=""><img src="vite.svg " className="h-16"  alt="" /></a>
            </div>
       </section>
    )
}