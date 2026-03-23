import React from 'react'
import { XIcon, CheckCircleIcon } from 'lucide-react'
import twintLogo from '../assets/twint.svg'
interface TwintModalProps {
    isOpen: boolean
    onClose: () => void
    total: number
    email?: string
}
const TwintModal: React.FC<TwintModalProps> = ({
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
                    <img src="qr-code.png" />

                    <h3 className="inline-block py-0.5 px-2 bg-[#0364b1] text-2xl font-bold text-white mb-2">{total.toFixed(2)} Fr.</h3>
                    <p className="text-lg mb-4">Good Life Lounge</p>
                    <img src={twintLogo} className="logo twint mx-auto h-12" alt="Twint logo" />
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
export default TwintModal
