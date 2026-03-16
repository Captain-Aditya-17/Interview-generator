import { createContext, useState, useEffect } from "react";
import { getme } from "./auth.api";

export const  AuthContext = createContext()


export const AuthProvider = ({children})=>{

    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
      const getAndsetUser = async ()=>{
        const data = await getme()
        setuser(data.user)
        setloading(false)
      }

      getAndsetUser()
    
    }, [])
    
    return(
        <AuthContext.Provider value={{user,setuser,loading,setloading}}>
            {children}
        </AuthContext.Provider>
    )
}