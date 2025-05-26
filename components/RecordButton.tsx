'use client';

import { useEffect, useRef, useReducer } from "react";
import { useRecordState, AnalyzeResult } from "@/hooks/useRecordState";

// ブラウザAPIの結果をUIコンポーネント側で管理（マイク許可状態）
// この状態以外は 代入時に型エラーになる。マイク未確認|マイク確認|マイク拒否
type MicPermission = "idle" | "granted" | "denied";

export default function RecordButton() {
    const [state, dispatch] = useRecordState();
    const [permission, setPermission] = useReducer(
        (_: MicPermission, granted: MicPermission) => granted, "idle"
    );

    // 画面には表示されないけど裏で覚えておきたい値（再レンダリング不要）をuseRefで保持
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (
            typeof navigator !== "undefined" &&
            navigator.mediaDevices &&
            typeof navigator.mediaDevices.getUserMedia === "function"
        )
            // マイク許可確認
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => setPermission("granted"))
                .catch(() => setPermission("denied"))
    }, []);

    const handleRecord = async () => {
        if (permission !== "granted") {
            alert("マイクの使用が許可されていません");
            return;
        }

        dispatch({ type: "startRecording" })

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

            dispatch({ type: "startLoading" });
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
                dispatch({ type: "success", result: json });
            } catch (error) {
                dispatch({
                    type: "error",
                    message: "解析に失敗しました。もう一度お試しください。",
                });
            }
            stream.getTracks().forEach((track) => track.stop());
        }

        recorder.start();
        setTimeout(() => recorder.stop(), 10000) // 10秒録音
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <button
                onClick={handleRecord}
                disabled={state.status === "recording" || state.status === "loading"}
                className={`w-4/5 sm:w-48 sm:h-48 aspect-square rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-2xl text-white text-lg sm:text-2xl font-bold flex items-center justify-center hover:scale-105 transition
                     ${state.status === "recording" || state.status === "loading"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
            >
                {state.status === "recording" || state.status === "loading" ? "解析中..." : "解析開始"}
            </button>
            {permission === "denied" && (
                <p className="text-red-600 font-semibold">マイクの使用が許可されていません</p>
            )}

            {state.status === "loading" && (
                <p className="text-gray-700 animate-pulse font-medium">
                    🎧 解析中...しばらくお待ちください
                </p>
            )}

            {state.status === "error" && (
                <p className="text-red-600 font-semibold">{state.message}</p>
            )}

            {state.status === "success" && (
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-gray-900 px-4">
                    <h2 className="text-xl text-center font-bold mb-2">解析結果</h2>
                    <p className="text-black"><strong>BPM:</strong> <span className="font-mono">{state.result.bpm}</span></p>
                    <p className="text-black"><strong>Key:</strong> <span className="font-mono">{state.result.key}</span></p>
                    <p className="text-black"><strong>Camelot:</strong> <span className="font-mono"> {state.result.camelot}</span></p>
                    <button
                        onClick={() => dispatch({ type: "reset" })}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        トップに戻る
                    </button>
                </div>
            )}
        </div>
    )
}