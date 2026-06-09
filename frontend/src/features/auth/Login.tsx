import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import  ReCAPTCHA from "react-google-recaptcha";
import api from "../../config/axios";
import { Alert, Box, Container, TextField, Typography, Button } from "@mui/material";
import { AuthLayoutComponent } from "../../components/AuthLayout";

export function Login(){
    const [username, setUsername] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string|null>(null);
    const [errorMensaje, setErrorMensaje] = useState<string|null>(null);
    const [cargando, setCargando] = useState(false);

    const {loginState} = useContext(AuthContext);
    const captchaRef = useRef<ReCAPTCHA>(null);

    function alCambiarCaptcha(token:string|null){
        setCaptchaToken(token)
    }
    async function alEnviarFormulario(evento:any){
        evento.preventDefault();
        setErrorMensaje(null)

        if(!captchaToken){
            setErrorMensaje('PorFavor, marque la casilla de no soy un robot');
            return;
        }
        setCargando(true);
        try{
            const respuesta = await api.post('/auth/login',{
                username:username,
                contrasenia:contrasenia,
                captchaToken:captchaToken
            });
            const {access_token, ...datosUsuario} = respuesta.data;
            loginState(datosUsuario, access_token);
            alert('!Bienvenido al sistema')
        }catch (error:any){
            const mensaje = error.response?.data?.message||'Error al conectar con el servidor';
            setErrorMensaje(mensaje);

            setCaptchaToken(null);
            captchaRef.current?.reset();
        }finally{
            setCargando(false)
        }
    }

    return (
        <AuthLayoutComponent>
            <Container maxWidth='xs'>
                <Box 
                    sx={{
                        marginTop:8,
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                        boxShadow:3,
                        padding:3,
                        borderRadius:2,
                        backgroundColor:'background.paper'
                    }}>
                        <Typography component='h4' variant="h5" sx={{marginBottom:2, fontWeight:'bold'}}>
                            Ingresar
                        </Typography>
                        {errorMensaje &&(
                            <Alert severity="error" sx={{width:'100%', marginBottom:2}}>
                                {errorMensaje}
                            </Alert>
                        )}
                        <Box component='form' onSubmit={alEnviarFormulario} sx={{width:'100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Nombre de Usuario"
                                autoFocus
                                value={username}
                                onChange={function(e) {setUsername(e.target.value)}}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Contraseña"
                                type="password"
                                value={contrasenia}
                                onChange={function (e) {setContrasenia(e.target.value)}}
                            />
                            <Box sx={{display:'flex', justifyContent:'center', marginY:2, minHeight:'78px', width:'100%'}}>
                                <ReCAPTCHA
                                    ref={captchaRef}
                                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                    onChange={alCambiarCaptcha}
                                />
                            </Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={cargando}
                                sx={{ paddingY:1.5}}
                                >
                                {cargando ? 'verificando':'Ingresar al sistema'}

                            </Button>
                        </Box>

                </Box>

            </Container>
        </AuthLayoutComponent>
    )
    
}