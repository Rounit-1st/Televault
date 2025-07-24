export default function ExtraDetails(){
    return (
        <section className="grid gap-4 grid-cols-1 lg:grid-cols-3 m-16">
            <div className="flex flex-col items-center">
                <img src="cloudUpload.png" className="h-48" alt="" />
                <h3 className="font-extrabold text-2xl">Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus voluptatem enim aperiam ipsam nulla nobis.</p>
            </div>
            <div className="flex flex-col items-center">
                <img src="fastDownload.png" className="h-48" alt="" />
                <h3 className="font-extrabold text-2xl" >Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus voluptatem enim aperiam ipsam nulla nobis.</p>
            </div>
            <div className="flex flex-col items-center">
                <img src="encryption.png" className="h-48" alt="" />
                <h3 className="font-extrabold text-2xl" >Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus voluptatem enim aperiam ipsam nulla nobis.</p>
            </div>
       </section>
    )
}