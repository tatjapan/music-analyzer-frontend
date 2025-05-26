import { useReducer } from "react";
// 録音/解析のアプリ状態（loading, successなど）を管理


// 結果データの型
export type AnalyzeResult = {
    bpm: number;
    key: string;
    camelot: string;
};

// 状態定義
export type State =
    | { status: "idle" }
    | { status: "recording" }
    | { status: "loading" }
    | { status: "success"; result: AnalyzeResult }
    | { status: "error"; message: string };

// アクション定義
export type Action =
    | { type: "startRecording" }
    | { type: "startLoading" }
    | { type: "success"; result: AnalyzeResult }
    | { type: "error"; message: string }
    | { type: "reset" };

// 状態遷移ロジック
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "startRecording":
            return { status: "recording" };
        case "startLoading":
            return { status: "loading" };
        case "success":
            return { status: "success", result: action.result };
        case "error":
            return { status: "error", message: action.message };
        case "reset":
            return { status: "idle" };
    }
}

// カスタムフック
export function useRecordState() {
    return useReducer(reducer, { status: "idle" } as State);
}