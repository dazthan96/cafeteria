import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, IconButton, MenuItem, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CoffeeIcon from '@mui/icons-material/Coffee';
import api from '../../config/axios';

export function Productos() {
    const [productos, setProductos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [idEditando, setIdEditando] = useState<number | null>(null);

    useEffect(function () {
        async function cargarDatos() {
        try {
            const [resProductos, resCategorias] = await Promise.all([
            api.get('/productos'),
            api.get('/categorias')
            ]);
            setProductos(resProductos.data);
            setCategorias(resCategorias.data);
        } catch (error) {
            console.error('Error al sincronizar inventario:', error);
        } finally {
            setCargando(false);
        }
        }
        cargarDatos();
    }, []);

    async function guardarProducto(e: any) {
        e.preventDefault();

        if (!nombre.trim()) {
        alert('El nombre del producto es obligatorio');
        return;
        }
        if (!idCategoria) {
        alert('Debe asignar una categoría al producto');
        return;
        }
        const precioNumerico = Number(precioVenta);
        if (isNaN(precioNumerico) || precioNumerico <= 0) {
        alert('El precio de venta debe ser un número mayor a cero (Validación de campo)');
        return;
        }

        const datosPayload = {
        nombre: nombre,
        descripcion: descripcion,
        precio_venta: precioNumerico,
        id_categoria: Number(idCategoria)
        };

        try {
        if (idEditando) {
            await api.patch('/productos/' + idEditando, datosPayload);
            alert('Producto actualizado correctamente');
        } else {
            await api.post('/productos', datosPayload);
            alert('Producto añadido al inventario');
        }

        limpiarFormulario();
        const resActualizada = await api.get('/productos');
        setProductos(resActualizada.data);

        } catch (error) {
        alert('Ocurrió un error al procesar la solicitud en el servidor');
        }
    }

    function activarEdicion(prod: any) {
        setIdEditando(prod.id_producto);
        setNombre(prod.nombre);
        setDescripcion(prod.descripcion || '');
        setPrecioVenta(prod.precio_venta.toString());
        setIdCategoria(prod.categoria?.id_categoria?.toString() || '');
    }

    async function eliminarProductoLogico(id: number) {
        if (!confirm('¿Está seguro de dar de baja este producto del menú? (Se aplicará borrado lógico)')) return;

        try {
        await api.delete('/productos/' + id);
        
        setProductos(productos.filter(function (prod) {
            return prod.id_producto !== id;
        }));
        } catch (error) {
        alert('No se pudo dar de baja el producto');
        }
    }

    function limpiarFormulario() {
        setIdEditando(null);
        setNombre('');
        setDescripcion('');
        setPrecioVenta('');
        setIdCategoria('');
    }

    if (cargando) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <CircularProgress />
        </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
            <CoffeeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} /> Control de Productos (Menú)
        </Typography>

        <Paper sx={{ padding: 3, marginBottom: 4 }} component="form" onSubmit={guardarProducto}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {idEditando ? 'Modificar Artículo Seleccionado' : 'Registrar Nuevo Artículo'}
            </Typography>
            
            <Grid container spacing={2}>
            <Grid size={{xs:12, sm:4}}>
                <TextField
                label="Nombre del Producto"
                fullWidth
                value={nombre}
                onChange={function (e) { setNombre(e.target.value); }}
                slotProps={{htmlInput:{maxLength:100}}}
                />
            </Grid>
            
            <Grid size={{xs:12, sm:3}}>
                <TextField
                select
                label="Categoría"
                fullWidth
                value={idCategoria}
                onChange={function (e) { setIdCategoria(e.target.value); }}
                >
                {categorias.map(function (cat) {
                    return (
                    <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                    </MenuItem>
                    );
                })}
                </TextField>
            </Grid>

            <Grid size={{xs:12, sm:2}}>
                <TextField
                label="Precio (Bs.)"
                fullWidth
                value={precioVenta}
                onChange={function (e) { setPrecioVenta(e.target.value); }}
                />
            </Grid>

            <Grid size={{xs:12, sm:3}} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ height: '56px' }}>
                {idEditando ? 'Actualizar' : 'Guardar'}
                </Button>
                {idEditando && (
                <Button variant="outlined" color="secondary" onClick={limpiarFormulario} sx={{ height: '56px' }}>
                    X
                </Button>
                )}
            </Grid>

            <Grid size={{xs:12}}>
                <TextField
                label="Descripción o Ingredientes (Opcional)"
                fullWidth
                multiline
                rows={2}
                value={descripcion}
                onChange={function (e) { setDescripcion(e.target.value); }}
                />
            </Grid>
            </Grid>
        </Paper>

        <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Categoría</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="right">Precio</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {productos.map(function (prod) {
                return (
                    <TableRow key={prod.id_producto} hover>
                    <TableCell>{prod.id_producto}</TableCell>
                    <TableCell style={{ fontWeight: '500' }}>{prod.nombre}</TableCell>
                    <TableCell>{prod.categoria?.nombre || 'Sin Categoría'}</TableCell>
                    <TableCell>{prod.descripcion || '---'}</TableCell>
                    <TableCell align="right">Bs. {Number(prod.precio_venta).toFixed(2)}</TableCell>
                    <TableCell align="center">
                        <IconButton color="primary" onClick={function () { activarEdicion(prod); }}>
                        <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={function () { eliminarProductoLogico(prod.id_producto); }}>
                        <DeleteIcon />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </TableContainer>
        </Container>
    );
}
