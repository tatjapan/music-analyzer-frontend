'use client';

import { useEffect, useState } from "react";
// この状態以外は 代入時に型エラーになる。マイク未確認|マイク確認|マイク拒否
type MicPermission = "idle" | "granted" | "denied";

export default function RecordButton() {
    const [permission, setPermission] = useState<MicPermission>("idle");
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        // マイク許可確認
        navigator.mediaDevices.getUserMedia({audio: true}).then(()=> setPermission("granted")).catch(()=>setPermission("denied"))
    },[]);
    const handleRecord = () => {
        if (permission !== "granted") return alert("マイクの使用が許可されていません")
            setRecording(true);
        // TODO: 録音ロジック
        console.log("Rec start!")
    }
  return (
    <div className="flex flex-col items-center gap-6">
        <button
        onClick={handleRecord}
        className={`rounded-full bg-blue-600 text-white px-8 py-4 text-lg font-bold shadow-lg hover:bg-blue-700 transition ${recording ? "opacity-50 cursor-not-allowed":""}`}
        disabled={recording}
        >
            {recording ? "解析中...":"解析開始"}
        </button>
        {permission === "denied" && (
            <p className="text-red-600 font-semibold">マイクの使用が許可されていません</p>
        )}
    </div>
  )
}