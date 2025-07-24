import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import ExtraDetails from "../Components/extraDetails";
import Footer from "../Components/Footer";

export default function FileManage(){
    return (
       <>
       <Navbar/>
       <div className="h-lvh grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-green-300 ">First Div</div>
            <div className="bg-green-300">Seconde Div</div>
       </div>
       <Footer/>
       </>
    )
}