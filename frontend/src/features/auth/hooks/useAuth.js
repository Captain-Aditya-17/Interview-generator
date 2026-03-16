import { useContext, useEffect


    
 } from "react";
import { AuthContext } from "../services/auth.context";
import { login, register, logout, getme } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setuser, loading, setloading } = context


    const handleLogin = async ({ email, password }) => {
        try {
            setloading(true)
            const data = await login({
                email,
                password
            })
            
            setuser(data.user)
            console.log(data.user)
        } catch (error) {
            console.error("Login failed:", error)
        } finally{
            setloading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        try {
            
            setloading(true)
            const data = await register({
                username,
                email,
                password
            })
            
            setuser(data.user)
            console.log(data.user)
        } catch (error) {
            console.error("Register failed:", error)
        } finally{
            setloading(false)
        }
    }

    const handleLogout = async ()=>{
        try {
            setloading(true)
            const data = await logout()
            setuser(null)
        } catch (error) {
            console.error("Logout failed:", error)
        }
        finally{
            setloading(false)
        }
    }

        useEffect(() => {
          const getAndsetUser = async ()=>{
            try {
                const data = await getme()
                setuser(data.user)
            } catch (error) {
                console.error("Failed to get user:", error)
            }finally{
                setloading(false)
            }
          }
    
          getAndsetUser()
        
        }, [])

    return {user,loading,handleLogin,handleRegister,handleLogout

        
    }
}