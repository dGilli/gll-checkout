import React from 'react'
import { XIcon, CheckCircleIcon } from 'lucide-react'
interface CashModalProps {
    isOpen: boolean
    onClose: () => void
    total: number
    total,
    email?: string
}
const CashModal: React.FC<CashModalProps> = ({
    isOpen,
    onClose,
    total,
    email,
}) => {
    if (!isOpen) return null
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Vielen Dank!</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="p-6 text-center">
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Gesamtbetrag: {total.toFixed(2)} Fr.</h3>
                    <p className="text-lg mb-4">Die Kasse befindet sich unter der Bar.</p>
                    {email && (
                        <p className="text-gray-600">
                            Ein Beleg wurde an: <strong>{email}</strong> gesendet.
                        </p>
                    )}
                </div>
                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Schliessen
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CashModal
