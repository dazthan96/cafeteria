import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { Box, Button, Container, Grid, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Delete, ShoppingCart } from "@mui/icons-material";

export function NuevaVenta():React.ReactNode{
    const [productos, setProductos] = useState<any[]>([]);
    const [carrito, setCarrito] = useState<any[]>([]);

    const [ciCliente, setCiCliente] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo');

    const [productosSeleccionados, setProductosSeleccionados] = useState<any>('');
    const [cantidad, setCantidad] = useState(1);

    useEffect(function(){
        async function cargarProductos() {
            try {
                const respuesta = await api.get('/productos');
                setProductos(respuesta.data)
            } catch (error:any) {
                console.error("Error al cargar productos: ", error)
            }
        }
        cargarProductos();
    },[]);

    function agregarAlCarrito(){
        if(!productosSeleccionados) return;
        const existe = carrito.find(function(item){
            return item.id_producto ===productosSeleccionados.id_producto
        });
        if(existe){
            setCarrito(carrito.map(function(item){
                if(item.id_producto == productosSeleccionados.id_producto){
                    return {...item, cantidad:item.cantidad + cantidad}
                }
                return item;
            }));
        }else{
            setCarrito([...carrito,{
                id_producto:productosSeleccionados.id_producto,
                nombre: productosSeleccionados.nombre,
                precio_unitario:Number(productosSeleccionados.precio_venta),
                cantidad:cantidad
            }]);
        }
        setCantidad(1);
    }
    function quitarDelCarrito(idProducto:number){
            setCarrito(carrito.filter(function(item){
                return item.id_producto !==idProducto
            }))
        }
        let totalVenta = 0;
        for (const item of carrito){
            totalVenta = totalVenta + (item.cantidad * item.precio_unitario)
        }
        async function procesarVenta(){
            if(carrito.length === 0){
                alert('El carrito esta vacio');
                return
            }
            const datosSesion = localStorage.getItem('usuario');
            if(!datosSesion) return;
            const usuarioLogueado = JSON.parse(datosSesion);

            const payload ={
                id_usuario:usuarioLogueado.id_usuario,
                ci_cliente: ciCliente?Number(ciCliente):null,
                razon_social:razonSocial||null,
                metodo_pago: metodoPago,
                detalles:carrito
            };
            try {
                await api.post('/ventas',payload);
                alert ('!Venta registrada con exito');
                setCarrito([]);
                setCiCliente('');
                setRazonSocial('')
            } catch (error) {
                alert('Error al registrar la venta en el servidor')
            }
        }
        return(
            <Container maxWidth='lg' sx={{marginTop:0, maxHeight:'85vh'}}>
                <Typography variant="h4" sx={{marginRight:1, fontWeight:'bold'}}>
                    <ShoppingCart sx={{marginRight:1}}/> Nueva Venta
                </Typography>

                <Grid container spacing={4}>
                    <Grid size={{xs:12, md:5}}>
                        <Paper sx={{padding:3, marginBottom:3}}>
                            <Typography variant="h6" sx={{marginBottom:2}}>Datos del Cliente</Typography>
                            <TextField 
                                label="C.I. / NIT"
                                fullWidth
                                margin="normal"
                                value={ciCliente}
                                onChange={function (e){setCiCliente(e.target.value)}}
                            />
                            <TextField
                                label="Razon Social / nombre"
                                fullWidth
                                margin="normal"
                                value={razonSocial}
                                onChange={function(e){setRazonSocial(e.target.value)}}
                            />
                            <TextField
                                select
                                label="Metodo de pago"
                                fullWidth
                                margin="normal"
                                value={metodoPago}
                                onChange={function(e){setMetodoPago(e.target.value)}}
                            >
                                <MenuItem value="efectivo">Efectivo</MenuItem>
                                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                            </TextField>
                        </Paper>
                        <Paper sx={{padding:3}}>
                            <Typography variant="h6" sx={{marginBottom:2}}>Agregar Productos</Typography>
                            <TextField
                                select
                                label="Seleccionar producto"
                                fullWidth
                                margin="normal"
                                value={productosSeleccionados}
                                onChange={function(e){setProductosSeleccionados(e.target.value)}}    
                            >
                                {productos.map(function(prod){
                                    return(
                                        <MenuItem key={prod.id_producto} value={prod}>
                                            {prod.nombre} - Bs- {prod.precio_venta}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                            <TextField
                                label="Cantidad"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={cantidad}
                                onChange={function(e){setCantidad(Number(e.target.value))}}
                                slotProps={{htmlInput:{min:1}}}
                            />
                            <Button 
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{marginTop:2}}
                                onClick={agregarAlCarrito}
                            >
                                Añadir al carrito
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:12, md:7}}>
                        <TableContainer component={Paper} sx={{padding:2}}>
                            <Typography variant="h6" sx={{marginBottom:2, paddingLeft:1}}>Detalles de Pedido</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor:'#f5f5f5'}}>
                                        <TableCell>Producto</TableCell>
                                        <TableCell align="right">Precio</TableCell>
                                        <TableCell align="right">Cantidad</TableCell>
                                        <TableCell align="right">SubTotal</TableCell>
                                        <TableCell align="center"> Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {carrito.map(function(item){
                                        return(
                                            <TableRow key={item.id_producto}>
                                                <TableCell>{item.nombre}</TableCell>
                                                <TableCell align="right">Bs. {item.precio_unitario}</TableCell>
                                                <TableCell align="right">{item.cantidad}</TableCell>
                                                <TableCell align="right">Bs.{item.cantidad * item.precio_unitario}</TableCell>
                                                <TableCell align="center">
                                                    <Button color="error" onClick={function(){quitarDelCarrito(item.id_producto)}}>
                                                        <Delete/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            <Box sx={{marginTop:3, textAlign:'right', paddingRight:2}}>
                                <Typography variant="h5" sx={{fontWeight:'bold'}}>
                                    TOTAL A PAGAR: Bs. {totalVenta}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    sx={{marginTop:2, paddingX:4}}
                                    onClick={procesarVenta}
                                >
                                    Finalizar Venta
                                </Button>
                            </Box>
                        </TableContainer>
                    </Grid>

                </Grid>

            </Container>
        )
}