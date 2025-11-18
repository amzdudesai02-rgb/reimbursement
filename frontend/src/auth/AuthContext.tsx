import { createContext, useContext, useEffect, useState } from 'react'


type AuthCtx = { token: string | null, login: (t:string)=>void, logout: ()=>void }
const Ctx = createContext<AuthCtx>({ token: null, login: ()=>{}, logout: ()=>{} })


export function AuthProvider({ children }: { children: React.ReactNode }){
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  function login(t: string){ setToken(t); localStorage.setItem('token', t) }
  function logout(){ setToken(null); localStorage.removeItem('token') }
  useEffect(()=>{},[token])
  return <Ctx.Provider value={{ token, login, logout }}>{children}</Ctx.Provider>
}


export function useAuth(){ return useContext(Ctx) }