import { AppBar, Toolbar, Box, IconButton, Button, Drawer, Typography, Divider } from "@mui/material";
import { Menu } from "@mui/icons-material";
import logo1 from "../assets/logo1.png";
import React, { useState, useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';

export function Layout(): React.JSX.Element {
    const [menuLateral, setMenuLateral] = useState<boolean>(false);
    
    const { usuario, logoutState } = useContext(AuthContext);
    const navegar = useNavigate();

    function manejarMenu(): void {
        setMenuLateral(true);
    }

    function irVentas() {
        navegar("/");
        setMenuLateral(false);
    }

    function irHistorial() {
        navegar("/historial");
        setMenuLateral(false);
    }

    function irUsuario() {
        navegar("/usuarios");
        setMenuLateral(false);
    }

    function irProductos() {
        navegar("/productos");
        setMenuLateral(false);
    }

    function irCategorias() {
        navegar("/categorias");
        setMenuLateral(false);
    }

    function irEstadisticas() {
        navegar("/estadisticas");
        setMenuLateral(false);
    }

    async function ejecutarCerrarSesion() {
        if (confirm("¿Desea cerrar su sesión y salir del sistema POS?")) {
        await logoutState();
        navegar("/login");
        }
    }

    return (
        <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "background.default" }}>
        
        <AppBar position="static" sx={{ backgroundColor: "#8A6B7D" }}>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                aria-label="Menu"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={manejarMenu}
            >
                <Menu />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                LycoReco
            </Typography>

            
            <Box sx={{ marginRight: 3 }}>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Empleado: {usuario?.nombre} ({usuario?.rol?.toUpperCase()})
                </Typography>
            </Box>

            <Button 
                color="error" 
                variant="contained" 
                size="small" 
                startIcon={<LogoutIcon />}
                onClick={ejecutarCerrarSesion}
            >
                Salir
            </Button>
            </Toolbar>
        </AppBar>

        
        <Drawer anchor="left" open={menuLateral} onClose={function () { setMenuLateral(false); }}>
            <Box
            role="presentation"
            sx={{
                p:0,
                width:"250px",
                textAlign:'center',
                backgroundColor: "#8A6B7D",
                color: "primary.contrastText",
                minHeight: "100%",
            }}
            >
            <Box
                component="img"
                src={logo1}
                sx={{
                //width: "250px",
                maxWidth: "250px",
                objectFit: "contain",
                backgroundColor: "#DBD2D8",
                boxShadow:"none",
                p: 1,
                mb: 2,
                }}
            />
            <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: "bold" }}>
                Menú de Opciones
            </Typography>
            
            <Divider sx={{ backgroundColor: "rgba(255,255,255,0.12)", mb: 2 }} />

            {/* BOTONES INTERNOS DEL MENÚ LATERAL (MUI NATIVOS) */}
            <Button 
                fullWidth 
                color="inherit" 
                sx={{ paddingY: 1.5, textTransform: 'none', justifyContent: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }} 
                onClick={irVentas}
            >
                Nueva Venta
            </Button>

            <Button 
                fullWidth 
                color="inherit" 
                sx={{ paddingY: 1.5, textTransform: 'none', justifyContent: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }} 
                onClick={irHistorial}
            >
                Historial de Ventas
            </Button>

            {/* FILTRO DE ROLES EXCLUSIVO PARA EL ADMINISTRADOR */}
            {usuario?.rol === "admin" && (
                <>
                <Button 
                    fullWidth 
                    color="inherit" 
                    sx={{ paddingY: 1.5, textTransform: 'none', justifyContent: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }} 
                    onClick={irProductos}
                >
                    Gestión de Productos
                </Button>

                <Button 
                    fullWidth 
                    color="inherit" 
                    sx={{ paddingY: 1.5, textTransform: 'none', justifyContent: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }} 
                    onClick={irCategorias}
                >
                    Gestión de Categorías
                </Button>

                <Button 
                    fullWidth 
                    color="inherit" 
                    sx={{ paddingY: 1.5, textTransform: 'none', justifyContent: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }} 
                    onClick={irUsuario}
                >
                    Control de Personal
                </Button>

                <Button 
                    fullWidth 
                    color="inherit" 
                    sx={{ paddingY: 1.5, textTransform: 'none', justifyContent: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }} 
                    onClick={irEstadisticas}
                >
                    Gráficos Estadísticos
                </Button>
                </>
            )}
            </Box>
        </Drawer>

        {/* CUERPO DINÁMICO CONTENEDOR DE PANTALLAS */}
        <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
            <Outlet />
        </Box>
        </Box>
    );
}
