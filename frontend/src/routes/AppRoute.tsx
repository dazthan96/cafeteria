import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../features/auth/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { NuevaVenta } from "../features/ventas/NuevaVenta";
import { Estadisticas } from "../features/dashboard/Estadisticas";
import { Historial } from "../features/ventas/Historial";
import { AuditoriaLogs } from "../features/auth/AuditoriaLogs";
import { Categorias } from "../features/inventario/Categorias";
import { Productos } from "../features/inventario/Productos";
import { Layout } from "../components/Layout";
import { Usuarios } from "../features/auth/Usuarios";

export function AppRoutes(){
    const {token, usuario} = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                path="/login"element={!token ? <Login/> : <Navigate to="/" replace/>}/>
                <Route element={<ProtectedRoute rolesPermitidos={['admin', 'barista']}/>}>
                    <Route element={< Layout/>} >
                        <Route path="/" element={<NuevaVenta/>} />
                        <Route path="/historial" element={<Historial />}/>
                        <Route element={<ProtectedRoute rolesPermitidos={['admin']}/>}>
                            <Route path="/estadisticas" element={<Estadisticas/>}/>
                            <Route path="/auditoria" element={<AuditoriaLogs/>} />
                            <Route path="/categorias" element={<Categorias/>} />
                            <Route path="/productos" element={<Productos />} />
                            <Route path="/usuarios" element={<Usuarios/>} />
                        </Route>
                    </Route>
                </Route>    
                
                
                <Route path="*" element={<Navigate to="/" replace />}/>
            </Routes>
        </BrowserRouter>
    )
}