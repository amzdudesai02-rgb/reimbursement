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
import { AuthProvider, useAuth } from './auth/AuthContext'
import logo from './assets/logo.png'


function Protected({ children }: { children: JSX.Element }){
    const { token } = useAuth()
    return token ? children : <Navigate to="/login" replace />
}


function Shell(){
    const { token, logout } = useAuth()
    return (
       <div className="min-h-screen bg-neutral-50 text-navy">
        <nav className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
         <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="amzDUDES" className="h-7"/>
          </Link>
          <div className="flex-1"/>
          <Link to="/pricing" className="hover:underline">Pricing</Link>
          <Link to="/reimbursement-tool" className="hover:underline">Tool</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          {token ? (
              <>
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <button onClick={logout} className="ml-3 px-3 py-1 rounded-full text-white" style={{backgroundImage:'linear-gradient(135deg,#FF9900,#FF6A00)'}}>Logout</button>
              </>
           ) : (
              <Link to="/login" className="px-3 py-1 rounded-full text-white" style={{backgroundImage:'linear-gradient(135deg,#FF9900,#FF6A00)'}}>Login</Link>
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