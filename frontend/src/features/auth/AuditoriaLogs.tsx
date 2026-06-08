import { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, CircularProgress } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import api from '../../config/axios';

export function AuditoriaLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);


    function formatearFechaSegura(fechaRaw: any) {
        if (!fechaRaw) {
            return '---';
        }
        
        const fechaObjeto = new Date(fechaRaw);
        if (isNaN(fechaObjeto.getTime())) {
            return 'Error formato';
        }
        return fechaObjeto.toLocaleString();
    }

    useEffect(function () {
        async function obtenerLogs() {
        try {
            const respuesta = await api.get('/registros-acceso');
            setLogs(respuesta.data);
        } catch (error) {
            console.error('Error al recuperar los logs de acceso:', error);
        } finally {
            setCargando(false);
        }
        }
        obtenerLogs();
    }, []);

    function renderizarChipEvento(evento: string) {
        if (evento === 'Ingreso') {
        return <Chip label="INGRESO" color="success" size="small" sx={{ fontWeight: 'bold' }} />;
        }
        if (evento === 'Salida') {
        return <Chip label="SALIDA" color="info" size="small" sx={{ fontWeight: 'bold' }} />;
        }
        return <Chip label="FALLIDO" color="error" size="small" sx={{ fontWeight: 'bold' }} />;
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
            <SecurityIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} /> Control de Accesos y Auditoría (Logs)
        </Typography>

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
            <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Usuario</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Nombre Empleado</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Evento</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Dirección IP</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Navegador / Browser</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Fecha / Hora Ingreso</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Fecha / Hora Salida</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {logs.map(function (log) {
                return (
                    <TableRow key={log.idRegistros} hover>
                    
                    <TableCell>{log.usuario?.username || 'Anónimo / Desconocido'}</TableCell>
                    <TableCell>{log.usuario ? log.usuario.nombre_usuario + ' ' + log.usuario.apellido_usuario : '---'}</TableCell>
                    <TableCell>{renderizarChipEvento(log.evento)}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    
                    <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.browser}>
                        {log.browser}
                    </TableCell>
                    <TableCell>
                        {formatearFechaSegura(log.fechaIngreso || log.fecha_ingreso)}
                    </TableCell>
                    <TableCell>
                    {log.fechaSalida || log.fecha_salida
                        ? formatearFechaSegura(log.fechaSalida || log.fecha_salida)
                        : <Typography variant="caption" color="text.secondary">Sesión Activa</Typography>
                    }
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
