import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Box, CircularProgress } from "@mui/material"
import { Navigate, Outlet } from "react-router-dom"

interface ProtectedRouteProps{
    rolesPermitidos?:('admin'|'barista')[]
}
export function ProtectedRoute({rolesPermitidos}:ProtectedRouteProps){
    const {usuario, token, cargando} = useContext(AuthContext)
    if(cargando){
        return(
            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }
    if (!token||!usuario){
        return <Navigate to="/login" replace/>
    }
    if(rolesPermitidos && !rolesPermitidos.includes(usuario.rol)){
        return <Navigate to="/" replace/>
    }
    return <Outlet/>;
}