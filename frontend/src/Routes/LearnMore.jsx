import Navbar from '../Components/Navbar.jsx'

export default function LearnMore() {
  return (
    <> <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-gray-800 px-6 py-12">
       
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/40 p-10">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-2">
            Televault Guide
          </p>

          <h1 className="text-5xl font-bold mb-4">
            Setup Your Telegram API
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to <span className="font-semibold text-black">Televault</span>,
            your personal cloud storage powered by Telegram.
            Store, manage, and access files securely using Telegram as your free backend.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">

          {/* Step 1 */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-3">
              1. Open Telegram and Search BotFather
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Open Telegram and search for{" "}
              <span className="font-semibold text-black">BotFather</span>,
              the official Telegram bot used to create and manage bots.
            </p>

            <img
              src="/botfather.png"
              alt="BotFather"
              className="rounded-xl shadow-md w-full"
            />
          </div>

          {/* Step 2 */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-3">
              2. Create a New Bot
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Start BotFather and send the command{" "}
              <span className="font-semibold text-black">/newbot</span>.
              It will ask for your bot name and then a unique username
              ending with <span className="font-semibold text-black">bot</span>.
            </p>

            <div className="space-y-4">
              <img
                src="/createNewBot.png"
                alt="Create New Bot"
                className="rounded-xl shadow-md w-full"
              />

              <img
                src="/botCreated.png"
                alt="Bot Created"
                className="rounded-xl shadow-md w-full"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-3">
              3. Copy Your Bot Token
            </h2>

            <p className="text-gray-600 leading-relaxed">
              After creating the bot, BotFather will generate your{" "}
              <span className="font-semibold text-black">
                Bot Token (API Key)
              </span>.
              Copy and save this token safely — Televault will use it
              to upload and manage your files.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-3">
              4. Create a Telegram Group
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Create a new Telegram group that will act as your private
              storage space for files. Example:
              <span className="font-semibold text-black">
                {" "}Televault Storage
              </span>
            </p>

            <img
              src="/group.png"
              alt="Telegram Group"
              className="rounded-xl shadow-md w-full"
            />
          </div>

          {/* Step 5 */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-3">
              5. Add Your Bot to the Group
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Open group settings and add your newly created bot as a member.
              Make sure the bot is successfully added.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-3">
              6. Send Any Message in the Group
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Send a simple message like{" "}
              <span className="font-semibold text-black">hello</span>
              inside the group so Telegram registers the group activity.
            </p>
          </div>

          {/* Step 7 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-3">
              7. Open Televault Setup Page
            </h2>

            <p className="leading-relaxed mb-6">
              Instead of manually opening Telegram API URLs,
              simply go to the setup page and paste your Bot Token there.
            </p>

            <a
              href="/telegramApiManage"
              className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow hover:scale-105 transition"
            >
              Open Telegram API Setup
            </a>
          </div>

          {/* Step 8 */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-3">
              8. Click Connect
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Televault will automatically verify your Bot Token,
              detect your Telegram group, fetch the Group ID,
              and complete the setup.
            </p>
          </div>

          {/* Step 9 */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-3">
              9. Done 🎉
            </h2>

            <p className="text-lg leading-relaxed">
              Your Telegram storage is now connected.
              Start uploading, organizing, and downloading files directly from Televault.
            </p>
          </div>

        </div>
      </div>
    </div>
    </> 

  );
}