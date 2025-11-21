import type { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Cases from './pages/Cases'
import Reports from './pages/Reports'
import Documents from './pages/Documents'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Settings from './pages/Settings'
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
        <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
         <div className="max-w-6xl mx-auto flex items-center gap-6 px-4 py-3 text-sm font-medium text-slate-600">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="amzDUDES" className="h-8"/>
          </Link>
          <div className="hidden md:flex items-center gap-6 flex-1">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900">How It Works</a>
            <Link to="/pricing" className="hover:text-slate-900">Pricing</Link>
            <a href="#security" className="hover:text-slate-900">Security</a>
            <Link to="/contact" className="hover:text-slate-900">Company</Link>
          </div>
          {token ? (
              <>
                <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
                <button onClick={logout} className="rounded-full bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800">
                  Logout
                </button>
              </>
           ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-slate-900">Sign In</Link>
                <Link to="/signup" className="rounded-full bg-[#0B64FF] px-4 py-2 text-white shadow hover:bg-[#0853d6]">
                  Start Free Audit
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
     <Routes>
       <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
       <Route path="/cases" element={<Protected><Cases/></Protected>} />
       <Route path="/reports" element={<Protected><Reports/></Protected>} />
       <Route path="/documents" element={<Protected><Documents/></Protected>} />
       <Route path="/inventory" element={<Protected><Inventory/></Protected>} />
       <Route path="/orders" element={<Protected><Orders/></Protected>} />
       <Route path="/users" element={<Protected><Users/></Protected>} />
       <Route path="/settings" element={<Protected><Settings/></Protected>} />
       <Route path="/*" element={<Shell/>} />
     </Routes>
    </BrowserRouter>
   </AuthProvider>
  )
}