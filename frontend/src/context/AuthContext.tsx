import React, {  createContext, useEffect, useState} from "react";
import api from "../config/axios";


interface AuthState{
    id_usuario:number;
    username:string;
    nombre:string;
    apellido: string;
    rol:'admin'|'barista'
}

interface AuthContextProps{
    usuario:AuthState|null;
    token:string |null;
    cargando: boolean;
    loginState: (datosUsuario:any, tokenRecibido:string)=>void;
    logoutState: ()=>Promise<void>
}
export const AuthContext = createContext<AuthContextProps>({}as AuthContextProps);
export function AuthProvider({children}:{children:React.ReactNode}){
    const [usuario, setUsuario] = useState<AuthState|null>(null);
    const [token, setToken] = useState<string|null>(null);
    const [cargando, setCargando] = useState(true)

    useEffect(function(){
        const tokenGuardado = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');

        if(tokenGuardado && usuarioGuardado){
            setToken(tokenGuardado);
            setUsuario(JSON.parse(usuarioGuardado))
        }
        setCargando(false);
    },[]);

    function loginState(datosUsuario:any, tokenRecibido:string){
        setToken(tokenRecibido);
        setUsuario(datosUsuario);

        localStorage.setItem('token', tokenRecibido);
        localStorage.setItem('usuario', JSON.stringify(datosUsuario))
    }

    async function logoutState(){
        if(usuario){
            try{
                await api.post('/auth/logout/'+usuario.id_usuario);
            }catch(error){
                console.error('Error al registrar el log de salida en el servidor')
            }
        }
        setToken(null);
        setUsuario(null);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario')
    }
    return (
        <AuthContext.Provider value = {{usuario, token, cargando, loginState, logoutState}}>
            {children}
        </AuthContext.Provider>
    )
}