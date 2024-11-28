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
    <main className="p-4">
      <div className="space-x-4 mb-8">
        <button
          onClick={startBot}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          1. Start Bot
        </button>
        {token && roomUrl && (
          <a
            href={`${roomUrl}?t=${token}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded inline-block"
          >
            2. Join Room
          </a>
        )}
        <button
          onClick={getRecordings}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Get Recordings
        </button>
      </div>

      {isLoadingRecordings ? (
        <div>Loading recordings...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Download Link</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((recording: DailyRecording) => (
                <tr key={recording.id} className="hover:bg-gray-50">
                  <td className="border p-2">{recording.id}</td>
                  <td className="border p-2">{recording.start_ts}</td>
                  <td className="border p-2">{recording.status}</td>
                  <td className="border p-2">{recording.duration || "N/A"}</td>
                  <td className="border p-2">
                    <a href={recording.download_link}>Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recordings.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No recordings found
            </div>
          )}
        </div>
      )}
    </main>
  );
};
