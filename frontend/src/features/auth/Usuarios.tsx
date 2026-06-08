import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, IconButton, MenuItem, Grid, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../../config/axios';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Campos del formulario
  const [idUsuario, setIdUsuario] = useState(''); // <-- Nuevo campo para el C.I.
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [rol, setRol] = useState('barista');
  const [idEditando, setIdEditando] = useState<number | null>(null); // Manejo de edición
  
  // Estado informativo de fortaleza
  const [fortaleza, setFortaleza] = useState('Débil');
  const [colorFortaleza, setColorFortaleza] = useState<'error' | 'warning' | 'success'>('error');

  // CARGAR USUARIOS ACTIVOS
  useEffect(function () {
    async function cargarUsuarios() {
      try {
        const respuesta = await api.get('/usuarios');
        setUsuarios(respuesta.data);
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      } finally {
        setCargando(false);
      }
    }
    cargarUsuarios();
  }, []);

  // EVALUAR FORTALEZA SÓLO COMO INFORMACIÓN BINARIA/VISUAL
  function evaluarContrasenia(texto: string) {
    setContrasenia(texto);
    if (texto.length === 0) {
      setFortaleza('Débil');
      setColorFortaleza('error');
      return;
    }
    const tieneNumeros = /\d/.test(texto);
    const tieneLetras = /[a-zA-Z]/.test(texto);
    const tieneEspeciales = /[@$!%*?&]/.test(texto);
    const longitudCorrecta = texto.length >= 8;

    if (longitudCorrecta && tieneNumeros && tieneLetras && tieneEspeciales) {
      setFortaleza('Fuerte');
      setColorFortaleza('success');
    } else if (texto.length >= 6 && tieneNumeros && tieneLetras) {
      setFortaleza('Intermedia');
      setColorFortaleza('warning');
    } else {
      setFortaleza('Débil');
      setColorFortaleza('error');
    }
  }

  // REGISTRAR O ACTUALIZAR
  async function guardarFormulario(e: any) {
    e.preventDefault();

    if (!idUsuario.trim() || !username.trim() || !nombre.trim() || !apellido.trim()) {
      alert('Todos los campos básicos son obligatorios');
      return;
    }

    // Si es nuevo, la contraseña es obligatoria obligatoriamente
    if (!idEditando && !contrasenia.trim()) {
      alert('La contraseña es obligatoria para nuevos registros');
      return;
    }

    const payload: any = {
      id_usuario: Number(idUsuario),
      username: username,
      nombre_usuario: nombre,
      apellido_usuario: apellido,
      rol: rol
    };

    // Sólo mandamos la contraseña al backend si el usuario escribió algo (en creación o cambio)
    if (contrasenia.trim()) {
      payload.contrasenia = contrasenia;
    }

    try {
      if (idEditando) {
        await api.patch('/usuarios/' + idEditando, payload);
        alert('Datos del empleado actualizados');
      } else {
        await api.post('/usuarios', payload);
        alert('¡Usuario registrado y encriptado con éxito!');
      }
      
      limpiarCampos();
      const nuevaRespuesta = await api.get('/usuarios');
      setUsuarios(nuevaRespuesta.data);
    } catch (error) {
      alert('Error en el servidor. Verifique duplicidad de C.I. o Nombre de Usuario.');
    }
  }

  function activarEdicion(user: any) {
    setIdEditando(user.id_usuario);
    setIdUsuario(user.id_usuario.toString()); // El campo C.I. se llena
    setUsername(user.username);
    setNombre(user.nombre_usuario);
    setApellido(user.apellido_usuario);
    setRol(user.rol);
    setContrasenia(''); // Dejamos vacío para que no se vea el hash
  }

  function desactivarUsuario(id: number) {
    if (!confirm('¿Está seguro de dar de baja a este usuario del sistema?')) return;
    async function ejecutarBaja() {
      try {
        await api.delete('/usuarios/' + id);
        setUsuarios(usuarios.filter(function (user) {
          return user.id_usuario !== id;
        }));
      } catch (error) {
        alert('Error al desactivar al usuario');
      }
    }
    ejecutarBaja();
  }

  function limpiarCampos() {
    setIdEditando(null);
    setIdUsuario('');
    setUsername('');
    setNombre('');
    setApellido('');
    setContrasenia('');
    setFortaleza('Débil');
    setColorFortaleza('error');
  }

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}><CircularProgress /></Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        <PersonAddIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} /> Gestión de Personal (Usuarios)
      </Typography>

      {/* FORMULARIO */}
      <Paper sx={{ padding: 3, marginBottom: 4 }} component="form" onSubmit={guardarFormulario}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {idEditando ? 'Modificar Empleado (C.I. Bloqueado)' : 'Registrar Nuevo Empleado'}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:3}}>
            <TextField 
              label="C.I. (Número de documento)" 
              fullWidth 
              value={idUsuario} 
              disabled={idEditando !== null} // <-- ¡CANDADO DE EXAMEN! Deshabilitado si está editando
              onChange={function (e) { setIdUsuario(e.target.value); }} 
            />
          </Grid>
          <Grid size={{xs:12, sm:3}}>
            <TextField label="Nombre" fullWidth value={nombre} onChange={function (e) { setNombre(e.target.value); }} /></Grid>
          <Grid size={{xs:12, sm:3}}>
            <TextField label="Apellido" fullWidth value={apellido} onChange={function (e) { setApellido(e.target.value); }} /></Grid>
          <Grid size={{xs:12, sm:3}}>
            <TextField label="Nombre de Usuario" fullWidth value={username} onChange={function (e) { setUsername(e.target.value); }} /></Grid>
          
          <Grid size={{xs:12, sm:5}}>
            <TextField 
              label={idEditando ? "Cambiar Contraseña (Dejar vacío para no alterar)" : "Contraseña"} 
              type="password" 
              fullWidth 
              value={contrasenia} 
              onChange={function (e) { evaluarContrasenia(e.target.value); }} 
            />
            <Box sx={{ marginTop: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption">Análisis Dinámico:</Typography>
              <Chip label={fortaleza} color={colorFortaleza} size="small" />
            </Box>
          </Grid>

          <Grid size={{xs:12, sm:4}}>
            <TextField select label="Rol del Sistema" fullWidth value={rol} onChange={function (e) { setRol(e.target.value); }}>
              <MenuItem value="barista">Barista (Vendedor)</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{xs:12, sm:3}}  sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ height: '56px' }}>
              {idEditando ? 'Actualizar' : 'Registrar'}
            </Button>
            {idEditando && (
              <Button variant="outlined" color="secondary" onClick={limpiarCampos} sx={{ height: '56px' }}>
                X
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell style={{ fontWeight: 'bold' }}>C.I. (ID)</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Nombre Completo</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map(function (user) {
              return (
                <TableRow key={user.id_usuario} hover>
                  <TableCell>{user.id_usuario}</TableCell>
                  <TableCell>{user.nombre_usuario} {user.apellido_usuario}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip label={user.rol.toUpperCase()} color={user.rol === 'admin' ? 'secondary' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={function () { activarEdicion(user); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={function () { desactivarUsuario(user.id_usuario); }}>
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

