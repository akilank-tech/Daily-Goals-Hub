import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const getWeatherDetails = (code, isDay) => {
    if (code === 0) return { condition: isDay ? 'Clear sky' : 'Clear night', icon: isDay ? 'sun' : 'moon' }
    if ([1, 2, 3].includes(code)) return { condition: 'Partly cloudy', icon: 'cloud' }
    if ([45, 48].includes(code)) return { condition: 'Foggy', icon: 'fog' }
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { condition: 'Rainy', icon: 'rain' }
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snowy', icon: 'snow' }
    if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorms', icon: 'storm' }
    return { condition: 'Cloudy', icon: 'cloud' }
}

const Landing = () => {
    const data = useLocation()
    const navigate = useNavigate()
    const user = data.state?.user || 'User'
    
    // Weather state
    const [city, setCity] = useState('')
    const [temperature, setTemperature] = useState('')
    const [weatherCondition, setWeatherCondition] = useState('')
    const [weatherIcon, setWeatherIcon] = useState('')
    const [weatherError, setWeatherError] = useState('')
    const [isLoadingWeather, setIsLoadingWeather] = useState(false)
    
    // Date/Time state
    const [currentDateTime, setCurrentDateTime] = useState(new Date())
    
    // Activities state
    const [activities, setActivities] = useState([
        { id: 1, name: 'Complete React project', completed: false },
        { id: 2, name: 'Review code', completed: false },
        { id: 3, name: 'Team meeting', completed: true },
    ])
    const [newActivity, setNewActivity] = useState('')

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const fetchWeatherForLocation = async (latitude, longitude) => {
        const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        if (!geoResponse.ok) throw new Error('Unable to find your location name')
        const geoData = await geoResponse.json()
        const cityName = geoData.city || geoData.locality || geoData.principalSubdivision || geoData.countryName
        if (!cityName) throw new Error('Unable to find your location name')

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&temperature_unit=celsius&timezone=auto`
        )
        if (!weatherResponse.ok) throw new Error('Unable to fetch weather data')
        const weatherData = await weatherResponse.json()
        const currentWeather = weatherData.current
        if (typeof currentWeather?.temperature_2m !== 'number' || typeof currentWeather.weather_code !== 'number') {
            throw new Error('Weather data is currently unavailable')
        }

        const details = getWeatherDetails(currentWeather.weather_code, currentWeather.is_day === 1)
        setCity(cityName)
        setTemperature(`${Math.round(currentWeather.temperature_2m)}°C`)
        setWeatherCondition(details.condition)
        setWeatherIcon(details.icon)
        setWeatherError('')
    }

    const detectLocation = () => {
        setWeatherError('')
        if (!window.isSecureContext) {
            setWeatherError('Location access requires a secure HTTPS connection')
            return
        }
        if (!navigator.geolocation) {
            setWeatherError('Geolocation is not supported by your browser')
            return
        }

        setIsLoadingWeather(true)
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    await fetchWeatherForLocation(coords.latitude, coords.longitude)
                } catch (error) {
                    setWeatherError(error.message || 'Unable to fetch weather data')
                } finally {
                    setIsLoadingWeather(false)
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setWeatherError('Location permission was denied. Allow location access in your browser settings and try again.')
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    setWeatherError('Your location is unavailable. Check that location services are enabled on your device.')
                } else if (error.code === error.TIMEOUT) {
                    setWeatherError('Location request timed out. Check your device location services and try again.')
                } else {
                    setWeatherError('Unable to access your location')
                }
                setIsLoadingWeather(false)
            },
            { enableHighAccuracy: false, timeout: 30000, maximumAge: 60000 }
        )
    }

    const toggleActivity = (id) => {
        setActivities(activities.map(activity =>
            activity.id === id ? { ...activity, completed: !activity.completed } : activity
        ))
    }

    const addActivity = (e) => {
        e.preventDefault()
        if (!newActivity.trim()) return
        const newActivityObj = {
            id: Date.now(),
            name: newActivity.trim(),
            completed: false
        }
        setActivities([...activities, newActivityObj])
        setNewActivity('')
    }

    const deleteActivity = (id) => {
        setActivities(activities.filter(activity => activity.id !== id))
    }

    return (
            <div className="min-h-screen bg-cream-50 text-teal-900 overflow-x-hidden">
                {/* Top navigation bar */}
                <nav className="sticky top-0 z-50 bg-white border-b border-teal-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 sm:h-20">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-xl sm:text-2xl font-bold text-teal-800 tracking-tight">Daily Goals Hub</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 sm:px-6 py-2 sm:py-3 border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 text-sm sm:text-base bg-teal-700 enabled:hover:bg-teal-800 text-white rounded-xl font-medium enabled:hover:scale-[1.02] enabled:active:scale-95 enabled:hover:shadow-lg enabled:hover:shadow-teal-600/30 transition-all duration-200 flex items-center gap-2 sm:gap-3 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Header Section */}
                    <div className="mb-8 sm:mb-12 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-3 py-1 sm:px-4 sm:py-1.5 bg-mint-200 text-teal-700 rounded-full text-sm sm:text-base font-medium mb-4 sm:mb-6 inline-block">
                            <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
                            Online
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-teal-900 mb-3 sm:mb-6 tracking-tight">
                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">{user}</span>! 👋
                        </h1>
                        <p className="text-teal-800 text-sm sm:text-lg max-w-2xl mx-auto sm:mx-0">
                            Manage your daily activities and stay productive. Here's what's happening today.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-700 text-sm sm:text-base font-medium">Total Activities</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-teal-900 mt-1">{activities.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-700 text-sm sm:text-base font-medium">Completed</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-teal-700 mt-1">{activities.filter(a => a.completed).length}</p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-700 text-sm sm:text-base font-medium">Pending</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-teal-700 mt-1">{activities.filter(a => !a.completed).length}</p>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weather & Date Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        {/* Weather Card */}
                        <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-teal-600/25 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <svg className="w-24 h-24 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" />
                                </svg>
                            </div>
                            <button
                                type="button"
                                onClick={detectLocation}
                                disabled={isLoadingWeather}
                                className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 enabled:hover:scale-[1.02] enabled:hover:bg-white/20 enabled:active:scale-95 disabled:cursor-wait disabled:opacity-70"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
                                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth={2} />
                                </svg>
                                {isLoadingWeather ? 'Detecting location...' : 'Location'}
                            </button>
                            <h2 className="text-white text-sm sm:text-base font-semibold mb-4 sm:mb-6 tracking-wider uppercase">Current Weather</h2>
                            <div className="flex items-center justify-between mb-6 sm:mb-8">
                                <div>
                                    <p className="text-white text-sm sm:text-base">{city || 'Select Location to begin'}</p>
                                    <p className="text-5xl sm:text-6xl font-bold text-white mt-1">{temperature || '--'}</p>
                                    <p className="mt-2 text-white text-sm sm:text-base">{weatherCondition || 'Weather conditions'}</p>
                                </div>
                                <div className="text-white" aria-label={weatherCondition || 'Weather icon'}>
                                    {weatherIcon === 'sun' && (
                                        <svg className="h-14 w-14 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <circle cx="12" cy="12" r="4" strokeWidth={2} />
                                            <path strokeLinecap="round" strokeWidth={2} d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                                        </svg>
                                    )}
                                    {weatherIcon === 'moon' && (
                                        <svg className="h-14 w-14 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.9 13A9 9 0 1111 3.1 7 7 0 0020.9 13z" />
                                        </svg>
                                    )}
                                    {weatherIcon === 'cloud' && (
                                        <svg className="h-14 w-14 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 18h10a4 4 0 000-8h-.5A6 6 0 005 11.5 3.5 3.5 0 007 18z" />
                                        </svg>
                                    )}
                                    {weatherIcon === 'fog' && (
                                        <svg className="h-14 w-14 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14h10a4 4 0 000-8h-.5A6 6 0 005 7.5 3.5 3.5 0 007 14zm-2 4h14m-12 3h10" />
                                        </svg>
                                    )}
                                    {weatherIcon === 'rain' && (
                                        <svg className="h-14 w-14 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14h10a4 4 0 000-8h-.5A6 6 0 005 7.5 3.5 3.5 0 007 14zm1 3-1 2m6-2-1 2m6-2-1 2" />
                                        </svg>
                                    )}
                                    {weatherIcon === 'snow' && (
                                        <svg className="h-14 w-14 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13h10a4 4 0 000-8h-.5A6 6 0 005 6.5 3.5 3.5 0 007 13zm1 4h.01M12 18h.01M16 17h.01M12 21h.01" />
                                        </svg>
                                    )}
                                    {weatherIcon === 'storm' && (
                                        <svg className="h-14 w-14 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13h10a4 4 0 000-8h-.5A6 6 0 005 6.5 3.5 3.5 0 007 13zm5 1-3 5h3l-1 3 5-6h-3l1-2" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="bg-teal-800/30 rounded-xl p-3 sm:p-4 border border-teal-500/30">
                                <p className="text-white text-xs sm:text-sm">Weather data by Open-Meteo · Location by BigDataCloud</p>
                            </div>
                        </div>

                        {/* Date & Time Card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-teal-100 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-teal-700 text-sm sm:text-base font-semibold flex items-center gap-2 sm:gap-3">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Current Date & Time
                                </h2>
                                <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
                            </div>
                            <div className="text-center sm:text-left space-y-2 sm:space-y-3">
                                <p className="text-teal-700 text-sm sm:text-base font-medium">{currentDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="text-4xl sm:text-5xl font-bold text-teal-900 font-mono" id="current-time">{currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                            </div>
                            {weatherError && (
                                <div className="mt-4 sm:mt-6 p-3 rounded-lg bg-red-50 text-red-600 text-xs sm:text-sm">
                                    {weatherError}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Management Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-teal-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
                                <div>
                                    <h2 className="mb-1 text-xl sm:text-2xl font-bold text-teal-900">Daily Goals Hub</h2>
                                    <p className="text-teal-700 text-sm sm:text-base">Track and complete your daily tasks</p>
                                </div>
                                <span className="px-4 py-2 sm:px-5 sm:py-2.5 bg-teal-100 text-teal-700 rounded-full text-xs sm:text-sm font-medium">
                                    {activities.length} Activities
                                </span>
                            </div>

                            {/* Add Activity Form */}
                            <form onSubmit={addActivity} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Add a new activity..."
                                        value={newActivity}
                                        onChange={(e) => setNewActivity(e.target.value)}
                                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-teal-200 rounded-xl text-teal-900 placeholder-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base bg-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 sm:px-8 py-3 sm:py-4 border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-xl font-bold text-sm sm:text-base enabled:hover:from-teal-800 enabled:hover:to-teal-900 enabled:hover:scale-[1.02] enabled:hover:shadow-lg enabled:hover:shadow-teal-600/30 enabled:hover:-translate-y-0.5 enabled:active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:active:scale-100 transition-all duration-200 shadow-lg shadow-teal-600/25 whitespace-nowrap cursor-pointer"
                                >
                                    Add Activity
                                </button>
                            </form>

                            {/* Activities List */}
                            <div className="space-y-0">
                                {activities.length === 0 ? (
                                    <div className="text-center py-12 sm:py-16">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-4 sm:mb-6">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-teal-900 mb-2">No activities yet</h3>
                                        <p className="text-teal-700 text-sm sm:text-base max-w-xs sm:max-w-none mx-auto">
                                            Get started by adding your first activity above!
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-teal-100">
                                        {activities.map((activity) => (
                                            <li key={activity.id} className="group flex items-center justify-between px-4 sm:px-5 py-6 sm:py-7 border-b border-teal-100 last:border-0 hover:bg-teal-50 transition-colors duration-200">
                                                <div className="flex items-center gap-4 sm:gap-6">
                                                    <input
                                                        type="checkbox"
                                                        checked={activity.completed}
                                                        onChange={() => toggleActivity(activity.id)}
                                                        className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 rounded border-teal-300 focus:ring-teal-500 cursor-pointer transition-all"
                                                    />
                                                    <span
                                                        className={`text-sm sm:text-base font-medium transition-all duration-300 ${
                                                            activity.completed
                                                                ? 'line-through text-teal-700'
                                                                : 'text-teal-900'
                                                        }`}
                                                    >
                                                        {activity.name}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => deleteActivity(activity.id)}
                                                    className="border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 text-teal-700 enabled:hover:text-red-700 enabled:hover:bg-red-50 enabled:hover:scale-105 enabled:active:scale-90 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
                                                >
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
}

export default Landing;