export default function ExtraDetails() {
    const features = [
        {
            img: "cloudUpload.png",
            title: import.meta.env.VITE_CLOUD_TITLE,
            description: import.meta.env.VITE_CLOUD_DESCRIPTION,
        },
        {
            img: "fastDownload.png",
            title: import.meta.env.VITE_FILE_DOWNLOAD_TITLE,
            description: import.meta.env.VITE_FILE_DOWNLOAD_DESCRIPTION,
        },
        {
            img: "encryption.png",
            title: import.meta.env.VITE_ENCRYPTION_TITLE,
            description: import.meta.env.VITE_ENCRYPTION_DESCRIPTION,
        },
    ];

    return (
        <section className="relative py-24 bg-gradient-to-b from-white via-slate-50 to-blue-50 overflow-hidden">
            {/* Background Blur */}
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6">

                {/* Section Heading */}
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-wider uppercase">
                        Why Televault?
                    </span>

                    <h2 className="mt-3 text-4xl md:text-5xl font-black text-gray-900">
                        Everything you need
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            in one cloud drive
                        </span>
                    </h2>

                    <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
                        Fast, secure, and built on Telegram's cloud
                        infrastructure. Manage your files with a modern
                        interface and zero storage headaches.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 p-8"
                        >
                            <div className="flex justify-center">
                                <div className="rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 p-5 group-hover:scale-110 transition">
                                    <img
                                        src={feature.img}
                                        alt={feature.title}
                                        className="h-24 w-24 object-contain"
                                    />
                                </div>
                            </div>

                            <h3 className="mt-8 text-2xl font-bold text-center text-gray-900">
                                {feature.title}
                            </h3>

                            <p className="mt-4 text-center text-gray-600 leading-7">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}