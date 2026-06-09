import { Box, CircularProgress, Container, Grid, Paper, Typography } from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import  {Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis}  from "recharts";

const COLORES_TORTA = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function Estadisticas():React.ReactNode{
    const [datosVentas, setDatosVentas] = useState<any[]>([])
    const [datosProductos, setDatosProductos] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)

    useEffect(function(){
        async function cargarEstadisticas() {
            try {
                const respuesta = await api.get('/ventas/estadisticas/dashboard');
                setDatosVentas(respuesta.data.ventasPorDia);
                setDatosProductos(respuesta.data.productosMasVendidos)
            } catch (error) {
                console.error("Error al recuperar las estadisticas del backend", error)
            }finally{
                setCargando(false)
            }
        }
        cargarEstadisticas();
    },[]);
    if(cargando){
        return (
            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'80vh'}}>
                <CircularProgress />
            </Box>
        );
    }
    return(
        <Container maxWidth='lg' sx={{marginTop:4}}>
            <Typography variant="h4" sx={{marginBottom:4, fontWeight:'bold'}}>
                <BarChart style={{marginRight:1}} />Panel de Analitica y estadisticas
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{xs:12, md:7}}>
                    <Paper sx={{padding:3, height:400}}>
                        <Typography variant="h6" sx={{marginBottom:2, fontWeight:'medium'}}>
                            Ventas Totales en los lUtimos Dias Bs.
                        </Typography>
                        
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={datosVentas}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="fecha"/>
                                <YAxis />
                                <Tooltip />
                                <Legend/>
                                <Bar dataKey="total" name="Total Vendido(Bs.)" fill="#1976d2" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid size={{xs:12, md:5}}>
                    <Paper sx={{padding:3, height:400}}>
                        <Typography variant="h6" sx={{marginBottom:2, fontWeight:'medium'}}>
                            Top 5 Productos Mas Vendidos en Unidades
                        </Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={datosProductos}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={function (entry){return entry.name}}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {datosProductos.map(function( index){
                                        return (
                                            <Cell key={'cell-'+index} fill={COLORES_TORTA[index % COLORES_TORTA.length]}/>
                                        )
                                    })}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}