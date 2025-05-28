import React from 'react'
import { useTranslation } from 'react-i18next';

type UsageNoticeModalProps = {
    onClose: () => void;
}

export default function UsageNoticeModal({ onClose }: UsageNoticeModalProps) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 bg-gray-400 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6 relative">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                    {t('usage_modal_title')}</h2>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
                    <li>{t('usage_modal_1')}</li>
                    <li>{t('usage_modal_2')}</li>
                    <li>{t('usage_modal_3')}</li>
                    <li>{t('usage_modal_4')}</li>
                </ul>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    {t('close')}
                </button>
            </div>
        </div>
    );
}