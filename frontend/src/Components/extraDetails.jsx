export default function ExtraDetails(){
    return (
        <section className="grid gap-4 grid-cols-1 lg:grid-cols-3 m-16">
            <div className="flex flex-col items-center">
                <img src="cloudUpload.png" className="h-48" alt="" />
                <h3 className="font-extrabold text-2xl">{import.meta.env.VITE_CLOUD_TITLE}</h3>
                <p>{import.meta.env.VITE_CLOUD_DESCRIPTION}</p>
            </div>
            <div className="flex flex-col items-center">
                <img src="fastDownload.png" className="h-48" alt="" />
                <h3 className="font-extrabold text-2xl" >{import.meta.env.VITE_FILE_DOWNLOAD_TITLE}</h3>
                <p>{import.meta.env.VITE_FILE_DOWNLOAD_DESCRIPTION}</p>
            </div>
            <div className="flex flex-col items-center">
                <img src="encryption.png" className="h-48" alt="" />
                <h3 className="font-extrabold text-2xl" >{import.meta.env.VITE_ENCRYPTION_TITLE}</h3>
                <p>{import.meta.env.VITE_ENCRYPTION_DESCRIPTION}</p>
            </div>
       </section>
    )
}