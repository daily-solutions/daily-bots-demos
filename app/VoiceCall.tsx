"use client";
import { UUID } from "crypto";
import { useState, useEffect } from "react";

type DailyRecording = {
  duration: number;
  id: string;
  isVttEnabled: boolean;
  mtgSessionId: UUID;
  room_name: string;
  s3key: string;
  share_token: string;
  start_ts: number;
  status: string;
};

type ExtendedRecording = DailyRecording & { download_link: string };

export const VoiceCallPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState("");
  const [roomUrl, setRoomUrl] = useState("");
  const [recordings, setRecordings] = useState<ExtendedRecording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  async function startBot() {
    try {
      const response = await fetch("/api/rtvi/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const { token = "", room_url = "" } = data;

      setToken(token);
      setRoomUrl(room_url);
      console.log("Config response:", data);
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  async function getRecordings() {
    try {
      setIsLoadingRecordings(true);
      const response = await fetch("/api/rtvi/recordings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const resultPromises = data.data.map(
        async (recording: DailyRecording) => {
          const response = await fetch(
            `/api/rtvi/recordings/${recording.id}/access-link`
          );
          const accessLinkData = await response.json();
          console.log("accessLinkData: ", accessLinkData.download_link);

          return { ...recording, ...accessLinkData };
        }
      );

      const results = await Promise.all(resultPromises);

      console.log("results: ", results);

      setRecordings(results || []);
      console.log("Recording response:", data);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      setIsLoadingRecordings(false);
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-8 tracking-tight leading-tight">
        Call Demo
      </h1>

      <div className="space-x-4 mb-8">
        <button onClick={startBot} className="btn-primary">
          1. Start Bot
        </button>

        {token && roomUrl && (
          <a
            href={`${roomUrl}?t=${token}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-block"
          >
            2. Join Room
          </a>
        )}

        <button onClick={getRecordings} className="btn-accent">
          Get Recordings
        </button>
      </div>

      {isLoadingRecordings ? (
        <div className="flex items-center justify-center p-8">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Created At</th>
                  <th className="table-cell">Status</th>
                  <th className="table-cell">Duration</th>
                  <th className="table-cell">Download Link</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recordings.map((recording: ExtendedRecording) => (
                  <tr
                    key={recording.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="table-cell">{recording.id}</td>
                    <td className="table-cell">{recording.start_ts}</td>
                    <td className="table-cell">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {recording.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {recording.duration || "N/A"}
                    </td>
                    <td className="table-cell">
                      <a
                        href={recording.download_link}
                        className="download-link"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recordings.length === 0 && (
              <div className="empty-state">
                <svg
                  className="empty-state-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="empty-state-title">No recordings found</p>
                <p className="empty-state-subtitle">
                  Start a bot session to create recordings
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
