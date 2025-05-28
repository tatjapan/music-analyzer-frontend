import React from 'react'

type UsageNoticeModalProps = {
    onClose: () => void;
}

export default function UsageNoticeModal({ onClose }: UsageNoticeModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-gray-400 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6 relative">
                <h2 className="text-lg font-bold mb-4 text-gray-800">利用上の注意</h2>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
                    <li>録音は最大10秒間実行されます。</li>
                    <li>周囲のノイズや解析箇所、音楽の品質によって、解析結果の精度が変動します。</li>
                    <li>録音データは解析後すぐに破棄され、保存されません。</li>
                    <li>不正アクセス防止のため、短期間にアクセスが集中するとアプリ利用が制限されます。</li>
                </ul>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
}