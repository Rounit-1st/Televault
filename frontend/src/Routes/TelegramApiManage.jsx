import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useState } from "react";
import { getTelegramGroupId } from "../api/getTelegramGroupID.js" ;


export default function TelegramApiManage(){
    return (
       <>
       <Navbar/>
        <TelegramSetup/>
       <Footer/>
       </>
    )
}

function TelegramSetup() {
    const [botToken, setBotToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [groupData, setGroupData] = useState(null);
    const [message, setMessage] = useState("");

const backendUrl = "http://localhost:3000";

const handleConnect = async () => {
    try {
        const response = await fetch(
            `${backendUrl}/telegramApiManage/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    telegramBotToken: botToken,
                    telegramChatId: groupData.groupId,
                }),
            }
        );

        const data = await response.json();

        setMessage(data.message);

        if (!data.success) {
            if (
                data.message === "Not authorized" ||
                data.message === "Invalid Token"
            ) {
                setTimeout(() => {
                    window.location.href = "/home";
                }, 1000);
            }
            return;
        }

        setTimeout(() => {
            window.location.href = "/filemanage";
        }, 1000);
    } catch (error) {
        setMessage("Something went wrong, please try again");
    }
};


const handleUpdate = async () => {
    try {
        const response = await fetch(
            `${backendUrl}/telegramApiManage/update`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    telegramBotToken: botToken,
                    telegramChatId: groupData.groupId,
                }),
            }
        );

        const data = await response.json();

        setMessage(data.message);

        if (!data.success) {
            if (
                data.message === "Not authorized" ||
                data.message === "Invalid Token"
            ) {
                setTimeout(() => {
                    window.location.href = "/home";
                }, 1000);
            }
            return;
        }

        setTimeout(() => {
            window.location.href = "/filemanage";
        }, 1000);
    } catch (error) {
        setMessage("Something went wrong, please try again");
    }
};


const handleDelete = async () => {
    try {
        const response = await fetch(
            `${backendUrl}/telegramApiManage/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        const data = await response.json();

        setMessage(data.message);

        if (!data.success) {
            if (
                data.message === "Not authorized" ||
                data.message === "Invalid Token"
            ) {
                setTimeout(() => {
                    window.location.href = "/home";
                }, 1000);
            }
            return;
        }

        setTimeout(() => {
            window.location.href = "/filemanage";
        }, 1000);
    } catch (error) {
        setMessage("Something went wrong, please try again");
    }
};

    const handleVerify = async () => {
        if (!botToken.trim()) {
            setMessage("Please enter Bot Token");
            return;
        }

        setLoading(true);
        setMessage("");
        setVerified(false);
        setGroupData(null);

        try {
            const res = await getTelegramGroupId(botToken);

            if (!res.success) {
                setMessage(res.message);
                setLoading(false);
                return;
            }

            setVerified(true);
            setGroupData({
                groupId: res.groupId,
                groupName: res.groupName,
            });

            setMessage(`Connected to "${res.groupName}"`);
        } catch (err) {
            setMessage("Something went wrong");
        }

        setLoading(false);
    };



    return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Telegram Bot Token Manager
      </h1>

      <p className="text-gray-600 text-center mb-8">
        Paste your Telegram Bot Token to connect Televault
      </p>

      <div className="space-y-5">
        <div>
          <label className="block font-medium mb-2">
            Bot Token
          </label>

          <input
            type="text"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder="Paste your bot token here..."
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {groupData && (
          <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
            <p>
              <span className="font-semibold">
                Group Name:
              </span>{" "}
              {groupData.groupName}
            </p>

            <p>
              <span className="font-semibold">
                Group ID:
              </span>{" "}
              {groupData.groupId}
            </p>
          </div>
        )}

        {message && (
          <div
            className={`rounded-xl p-4 text-sm font-medium ${
              verified
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {!verified ? (
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleConnect}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Connect
            </button>

            <button
              onClick={handleUpdate}
              className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
            >
              Update Token
            </button>

            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Delete Previous Token
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          To get instructions for generating your Telegram Bot Token,
          click on{" "}
          <span className="font-semibold text-blue-600 cursor-pointer underline">
            Learn More
          </span>
        </p>
      </div>
    </div>
  </div>
);
}