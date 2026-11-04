import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login=(props)=>{
    const navigate = useNavigate()
    const[eusername,seteusername]=useState('')
    const[epassword,setepassword]=useState('')
    const [showPassword, setShowPassword] = useState(false)
    const[ruser,setruser]=useState(true)
    const [error, setError] = useState('')

    const handleUInput=(evt)=>{
        seteusername(evt.target.value)
        setError('')
    }
    const handleUPassword=(evt)=>{
        setepassword(evt.target.value)
        setError('')
    }
    const togglePassword = () => {
        setShowPassword(!showPassword)
    }
    const users = props.users
    
    const checkUser=()=>{
        if (!eusername || !epassword) {
            setError('Please enter both username and password')
            setruser(false)
            return
        }
        var userfound = false

        users.forEach((item)=>{
            if(item.username === eusername && item.password === epassword){
                console.log("login successful")
                userfound=true
                navigate("/landing",{state:{user:eusername}})
            }
        })
        if(userfound===false){
                console.log("login failed")
                setruser(false)   
                setError('Invalid username or password')
            }   
    }
    return(
        <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-mint-300/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-teal-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 w-full sm:max-w-md lg:max-w-lg bg-cream-50 border border-teal-200/50 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 hover:shadow-teal-600/20">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-5xl font-bold text-teal-900 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-teal-700 text-sm sm:text-base">Sign in to manage your activities</p>
                </div>

                {ruser ? (
                    <p className="text-sm sm:text-base text-teal-800 mb-6">I help you manage your activities after you login 🚀</p>
                ) : (
                    <p className="text-sm sm:text-base text-red-700 mb-6">Please sign up before you login.</p>
                )}

                {error && (
                    <div className="mb-6 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm sm:text-base animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-4 sm:space-y-5 mb-8">
                    <div className="relative group">
                        <input
                            onChange={handleUInput}
                            type="text"
                            placeholder="Username"
                            className="w-full pr-12 sm:pr-14 px-4 sm:px-5 py-3 sm:py-4 bg-white border border-teal-200 rounded-xl text-teal-900 placeholder-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                        />
                        <div aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 group-focus-within:text-teal-700 transition-colors">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="relative group">
                        <input
                            onChange={handleUPassword}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full pr-12 sm:pr-14 px-4 sm:px-5 py-3 sm:py-4 bg-white border border-teal-200 rounded-xl text-teal-900 placeholder-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 text-teal-700 cursor-pointer enabled:hover:text-teal-900 enabled:hover:scale-105 enabled:active:scale-90 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 transition-all duration-200"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    onClick={checkUser}
                    className="w-full px-6 py-4 sm:px-8 sm:py-5 border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 bg-gradient-to-r from-teal-700 to-teal-800 rounded-xl font-bold text-white text-sm sm:text-base enabled:hover:from-teal-800 enabled:hover:to-teal-900 enabled:hover:scale-[1.02] enabled:hover:shadow-lg enabled:hover:shadow-teal-600/30 enabled:hover:-translate-y-0.5 enabled:active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:active:scale-100 transition-all duration-200 shadow-lg shadow-teal-600/25 cursor-pointer"
                >
                    Login
                </button>

                <p className="mt-8 sm:mt-10 text-sm sm:text-base text-teal-800/90">
                    Don't have an account?{' '}
                    <Link to="/signin" className="text-teal-800 font-semibold underline underline-offset-4 hover:text-teal-900 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default Login;