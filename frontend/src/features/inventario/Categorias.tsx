import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import api from '../../config/axios';

export function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(function () {
    async function cargarCategorias() {
      try {
        const respuesta = await api.get('/categorias'); 
        setCategorias(respuesta.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setCargando(false);
      }
    }
    cargarCategorias();
  }, []);

  async function guardarCategoria(e: any) {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('El nombre de la categoría no puede estar vacío');
      return;
    }

    try {
      if (idEditando) {
        await api.patch('/categorias/' + idEditando, { nombre: nombre });
        alert('Categoría actualizada con éxito');
      } else {
        await api.post('/categorias', { nombre: nombre });
        alert('Categoría creada con éxito');
      }

      setNombre('');
      setIdEditando(null);
      const nuevaRespuesta = await api.get('/categorias');
      setCategorias(nuevaRespuesta.data);
    } catch (error) {
      alert('Error al guardar la categoría. Asegúrese de que no esté duplicada.');
    }
  }

  function activarEdicion(cat: any) {
    setIdEditando(cat.id_categoria);
    setNombre(cat.nombre);
  }

  async function eliminarCategoria(id: number) {
    if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

    try {
      await api.delete('/categorias/' + id);
      setCategorias(categorias.filter(function (cat) {
        return cat.id_categoria !== id;
      }));
    } catch (error) {
      alert('No se puede eliminar la categoría porque contiene productos activos (Restricción de DB)');
    }
  }

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        <CategoryIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} /> Gestión de Categorías
      </Typography>

      <Paper sx={{ padding: 3, marginBottom: 4 }} component="form" onSubmit={guardarCategoria}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {idEditando ? 'Editar Categoría' : 'Nueva Categoría'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Nombre de la Categoría"
            fullWidth
            value={nombre}
            onChange={function (e) { setNombre(e.target.value); }}
            slotProps={{htmlInput:{maxLength:50}}}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ minWidth: '150px' }}>
            {idEditando ? 'Actualizar' : 'Guardar'}
          </Button>
          {idEditando && (
            <Button variant="outlined" color="secondary" onClick={function () { setNombre(''); setIdEditando(null); }}>
              Cancelar
            </Button>
          )}
        </Box>
      </Paper>

      {/* LISTADO TABLA */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Nombre de Categoría</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map(function (cat) {
              return (
                <TableRow key={cat.id_categoria} hover>
                  <TableCell>{cat.id_categoria}</TableCell>
                  <TableCell>{cat.nombre}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={function () { activarEdicion(cat); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={function () { eliminarCategoria(cat.id_categoria); }}>
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
