import { TicketIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Purchase = () => {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const location = useLocation()
    const showtime = location.state.showtime
    const selectedSeats = location.state.selectedSeats || []
    const [isPurchasing, setIsPurchasing] = useState(false)
    
    const totalPrice = selectedSeats.length * showtime.seatPrice

    const onPurchase = async () => {
        setIsPurchasing(true)
        try {
            const response = await axios.post(
                `/showtime/${showtime._id}`,
                { seats: selectedSeats },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
            )
            navigate('/cinema')
            toast.success('Purchase successful!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            })
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Payment failed', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            })
        } finally {
            setIsPurchasing(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
            <Navbar />
            <div className="mx-4 h-fit rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
                <ShowtimeDetails showtime={showtime} />
                
                <div className="mt-4 flex flex-col justify-between rounded-lg bg-white p-4 shadow-md md:flex-row md:items-center">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Selected Seats:</span>
                            <div className="flex flex-wrap gap-1">
                                {selectedSeats.map((seat, index) => (
                                    <span 
                                        key={index}
                                        className="rounded bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-800"
                                    >
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-medium text-gray-600">
                                {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-lg font-bold text-indigo-600">
                                Total: ₹{totalPrice}
                            </p>
                        </div>
                    </div>
                    
                    {selectedSeats.length > 0 && (
                        <div className="mt-4 md:mt-0 md:pl-4">
                            <button
                                onClick={onPurchase}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-400 md:w-auto"
                                disabled={isPurchasing}
                            >
                                {isPurchasing ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <span>Confirm Purchase</span>
                                        <TicketIcon className="h-6 w-6 text-white" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Purchase