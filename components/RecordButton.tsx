'use client';

import { useEffect, useState, useRef } from "react";
// この状態以外は 代入時に型エラーになる。マイク未確認|マイク確認|マイク拒否
type MicPermission = "idle" | "granted" | "denied";

type AnalyzeResult = {
    bpm: number;
    key: string;
    camelot: string;
};


export default function RecordButton() {
    const [permission, setPermission] = useState<MicPermission>("idle");
    const [recording, setRecording] = useState(false);
    const [result, setResult] = useState<AnalyzeResult | null>(null);
    // 画面には表示されないけど裏で覚えておきたい値（再レンダリング不要）をuseRefで保持
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        // マイク許可確認
        navigator.mediaDevices.getUserMedia({ audio: true }).then(() => setPermission("granted")).catch(() => setPermission("denied"))
    }, []);

    const handleRecord = async () => {
        if (permission !== "granted") return alert("マイクの使用が許可されていません")
        setRecording(true);
        setResult(null);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        recorder.onstop = async () => {
            const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            // 検証用
            console.log([...formData.entries()]);
            console.log("Blob type:", audioBlob.type);
            try {
                const res = await fetch("http://localhost:8000/analyze", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json: AnalyzeResult = await res.json();
                setResult(json);
            } catch (error) {
                alert("解析エラーが発生しました")
            } finally {
                setRecording(false)
            }
        }

        recorder.start();
        setTimeout(() => {
            recorder.stop();
            stream.getTracks().forEach(track => track.stop());
        }, 10000) // 10秒録音
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <button
                onClick={handleRecord}
                className={`w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-2xl text-white text-xl font-bold flex items-center justify-center hover:scale-105 transition ${recording ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={recording}
            >
                {recording ? "解析中..." : "解析開始"}
            </button>
            {permission === "denied" && (
                <p className="text-red-600 font-semibold">マイクの使用が許可されていません</p>
            )}

            {result && (
                <div className="bg-white p-6 rounded-lg shadow-md w-72 text-gray-900">
                    <h2 className="text-xl text-center font-bold mb-2">解析結果</h2>
                    <p className="text-black"><strong>BPM:</strong> <span className="font-mono">{result.bpm}</span></p>
                    <p className="text-black"><strong>Key:</strong> <span className="font-mono">{result.key}</span></p>
                    <p className="text-black"><strong>Camelot:</strong> <span className="font-mono"> {result.camelot}</span></p>
                </div>
            )}
        </div>
    )
}