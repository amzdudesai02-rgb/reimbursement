import type { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ReimbursementTool from './pages/ReimbursementTool'
import VerifyEmail from './pages/VerifyEmail'
import { AuthProvider } from './auth/AuthContext'
import { useAuth } from './auth/useAuth'
import logo from './assets/logo.png'


function Protected({ children }: { children: JSX.Element }){
    const { token } = useAuth()
    return token ? children : <Navigate to="/login" replace />
}


function Shell(){
    const { token, logout } = useAuth()
    return (
       <div className="min-h-screen bg-neutral-50 text-navy">
        <nav className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-slate-100">
         <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="amzDUDES" className="h-8"/>
          </Link>
          <div className="hidden md:flex items-center gap-6 flex-1">
            <a href="#features" className="hover:text-slate-900">Product</a>
            <Link to="/pricing" className="hover:text-slate-900">Pricing</Link>
            <a href="#how-it-works" className="hover:text-slate-900">How it Works</a>
            <Link to="/reimbursement-tool" className="hover:text-slate-900">Training</Link>
            <Link to="/contact" className="hover:text-slate-900">Company</Link>
          </div>
          {token ? (
              <>
                <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
                <button
                  onClick={logout}
                  className="ml-3 rounded-full bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
           ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-[#0B64FF] px-4 py-2 text-white shadow hover:bg-[#0450d9]"
                >
                  Start free audit
                </Link>
              </div>
           )}
        </div>
     </nav>
     <main className="max-w-6xl mx-auto p-6">
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/pricing" element={<Pricing/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/reimbursement-tool" element={<ReimbursementTool/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/verify" element={<VerifyEmail/>} />
          <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
      </Routes>
     </main>
     <footer className="py-8 text-center text-sm text-neutral-500">© {new Date().getFullYear()} amzDUDES</footer>
  </div>
 )
}


export default function App(){
  return (
   <AuthProvider>
    <BrowserRouter>
     <Shell/>
    </BrowserRouter>
   </AuthProvider>
 )
}