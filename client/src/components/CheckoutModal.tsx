import React, { useEffect, useState } from 'react'
import { XIcon, BanknoteIcon } from 'lucide-react'
interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    total: number
    itemCount: number
    onCheckout: (method: string, email?: string) => void
}
const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    total,
    itemCount,
    onCheckout,
}) => {
    const [email, setEmail] = useState('')
    const [isValidEmail, setIsValidEmail] = useState(true)
    useEffect(() => {
        if (isOpen) {
            setEmail('')
            setIsValidEmail(true)
        }
    }, [isOpen])
    if (!isOpen) return null
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        // Simple email validation
        if (value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setIsValidEmail(true)
        } else {
            setIsValidEmail(false)
        }
    }
    const handleCheckout = (method: string) => {
        // Only validate email if it's not empty
        if (email && !isValidEmail) return
        onCheckout(method, email || undefined)
    }
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Schliessen Sie Ihren Kauf ab</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <p className="mb-4">
                            Sie sind dabei, einen Kauf von {itemCount}{' '}
                            {itemCount === 1 ? 'Artikel' : 'Artikeln'} für insgesamt{' '}
                            <span className="font-bold">{total.toFixed(2)} Fr.</span> abzuschliessen.
                        </p>
                        <p className="text-gray-600">
                            Bitte wählen Sie unten Ihre bevorzugte Zahlungsmethode aus.
                            Wenn Sie eine Quittung erhalten möchten, geben Sie bitte Ihre E-Mail-Adresse ein.
                        </p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium">
                            E-Mail für die Quittung (optional):
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="your@email.com"
                            className={`w-full p-2 border rounded-md ${!isValidEmail ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {!isValidEmail && (
                            <p className="mt-1 text-sm text-red-500">
                                Bitte geben Sie eine gültige E-Mail-Adresse ein
                            </p>
                        )}
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-medium">Wählen Sie die Zahlungsmethode:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleCheckout('cash')}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                                disabled={email !== '' && !isValidEmail}
                            >
                                <BanknoteIcon size={18} />
                                Bar bezahlen
                            </button>
                            <button
                                onClick={() => handleCheckout('twint')}
                                className="flex items-center justify-center gap-2 bg-[#262626] saturate-50 text-white py-3 px-4 rounded-md hover:bg-[#323232] transition-colors"
                                disabled={email !== '' && !isValidEmail}
                            >
                                <div className="flex items-center h-0 -ml-1">
                                    <svg height="30" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1_801)">
                                            <path d="M29.5902 23.5796C29.5902 23.929 29.3506 24.3483 29.0511 24.518L18.5091 30.6076C18.2096 30.7773 17.7205 30.7773 17.421 30.6076L6.87905 24.518C6.57956 24.3483 6.33997 23.919 6.33997 23.5796V11.4005C6.33997 11.061 6.57956 10.6318 6.87905 10.4621L17.421 4.37249C17.7205 4.20278 18.2096 4.20278 18.5091 4.37249L29.0511 10.4621C29.3506 10.6318 29.5902 11.061 29.5902 11.4005V23.5796Z" fill="white"/>
                                            <path d="M23.5305 17.51L20.7852 21.5431L19.3677 19.3768L20.9949 16.941C21.2944 16.5017 21.9433 15.3237 21.1945 13.6865C20.5856 12.3688 19.2778 11.7299 18.1298 11.7299C16.9817 11.7299 15.7239 12.3189 15.055 13.6865C14.2963 15.2539 14.9552 16.4818 15.2447 16.8911C15.2447 16.8911 16.1432 18.2188 16.9019 19.3369L18.1298 21.1038L19.9766 23.919C19.9866 23.939 20.2861 24.3882 20.8052 24.3882C21.2944 24.3882 21.6038 23.949 21.6338 23.8891L25.9564 17.5H23.5305V17.51ZM18.1198 17.6098C18.1198 17.6098 17.401 16.5217 16.9318 15.753C16.4327 14.9344 16.9917 13.7065 18.1198 13.7065C19.2479 13.7065 19.8069 14.9244 19.3078 15.753C18.8486 16.5217 18.1198 17.6098 18.1198 17.6098Z" fill="url(#paint0_radial_1_801)"/>
                                            <path d="M15.4643 21.4133L12.759 17.6098C12.759 17.6098 12.0402 16.5117 11.571 15.753C11.0719 14.9344 11.6309 13.7065 12.759 13.7065C12.8987 13.7065 13.0285 13.7265 13.1583 13.7564L14.1167 12.0094C13.6774 11.8197 13.2182 11.7299 12.7789 11.7299C11.6309 11.7299 10.3731 12.3189 9.70421 13.6865C8.94551 15.2539 9.60438 16.4818 9.89388 16.8911L14.6258 23.8991C14.6657 23.9589 14.9652 24.3982 15.4643 24.3982C15.9735 24.3982 16.263 23.9689 16.2929 23.909L17.7205 21.7328L16.4926 19.9259L15.4643 21.4133Z" fill="url(#paint1_radial_1_801)"/>
                                        </g>
                                        <defs>
                                            <radialGradient id="paint0_radial_1_801" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.5358 6.60588) scale(26.2881 26.6277)">
                                                <stop stopColor="#FFCC00"/>
                                                <stop offset="0.0915684" stopColor="#FFC800"/>
                                                <stop offset="0.1739" stopColor="#FFBD00"/>
                                                <stop offset="0.2528" stopColor="#FFAB00"/>
                                                <stop offset="0.3295" stopColor="#FF9100"/>
                                                <stop offset="0.4046" stopColor="#FF7000"/>
                                                <stop offset="0.4786" stopColor="#FF4700"/>
                                                <stop offset="0.5503" stopColor="#FF1800"/>
                                                <stop offset="0.5822" stopColor="#FF0000"/>
                                                <stop offset="1" stopColor="#FF0000"/>
                                            </radialGradient>
                                            <radialGradient id="paint1_radial_1_801" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9.54728 13.59) scale(11.6671 11.6671)">
                                                <stop stopColor="#00B4E6"/>
                                                <stop offset="0.201" stopColor="#00B0E3"/>
                                                <stop offset="0.3898" stopColor="#01A5DB"/>
                                                <stop offset="0.5737" stopColor="#0292CD"/>
                                                <stop offset="0.7546" stopColor="#0377BA"/>
                                                <stop offset="0.9316" stopColor="#0455A1"/>
                                                <stop offset="1" stopColor="#054696"/>
                                            </radialGradient>
                                            <clipPath id="clip0_1_801">
                                                <rect width="23.36" height="26.6544" fill="white" transform="translate(6.32001 4.17282)"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                Mit TWINT bezahlen
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Abbrechen
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CheckoutModal

