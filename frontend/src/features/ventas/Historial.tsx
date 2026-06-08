import { useEffect, useState } from "react";
import api from "../../config/axios";
import { Box, Button, CircularProgress, Collapse, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, PictureAsPdf } from "@mui/icons-material";

function FilaVenta({venta}:{venta:any}){
    const [abierto, setAbierto] = useState(false)

    async function descargarPDF() {
        try {
            const respuesta = await api.get('/ventas/'+venta.id_venta+'/pdf',{responseType:'blob',});
            const urlBlob = window.URL.createObjectURL(new Blob([respuesta.data]));
            const enlace = document.createElement('a');
            enlace.href = urlBlob;
            enlace.setAttribute('download', 'Factura_Venta_'+venta.id_venta+'.pdf')
            document.body.appendChild(enlace);
            enlace.click();

            enlace.parentNode?.removeChild(enlace);
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            alert('Error al descargar el pdf de la venta')
        }
    }
    return(
        <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={function () { setAbierto(!abierto); }}>
            {abierto ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{venta.id_venta}</TableCell>
        <TableCell>{new Date(venta.fecha_venta).toLocaleString()}</TableCell>
        <TableCell>{venta.razon_social || 'S/N'}</TableCell>
        <TableCell align="right">Bs. {Number(venta.monto_total).toFixed(2)}</TableCell>
        <TableCell align="center">{venta.metodo_pago.toUpperCase()}</TableCell>
        <TableCell align="center">
          <Button
            variant="outlined" 
            color="error" 
            startIcon={<PictureAsPdf />}
            onClick={descargarPDF}
          >
            PDF
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={abierto} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                Productos Vendidos
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venta.detalles?.map(function (detalle: any) {
                    return (
                      <TableRow key={detalle.id_detalle_venta}>
                        <TableCell>{detalle.producto?.nombre || 'Producto Eliminado'}</TableCell>
                        <TableCell align="right">Bs. {Number(detalle.precio_unitario).toFixed(2)}</TableCell>
                        <TableCell align="right">{detalle.cantidad}</TableCell>
                        <TableCell align="right">Bs. {Number(detalle.subtotal).toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
    )
}
export function Historial() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(function () {
    async function obtenerHistorial() {
      try {
        const respuesta = await api.get('/ventas');
        setVentas(respuesta.data);
      } catch (error) {
        console.error('Error al traer las ventas:', error);
      } finally {
        setCargando(false);
      }
    }
    obtenerHistorial();
  }, []);

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
        Historial de Ventas Realizadas
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell width="50px" />
              <TableCell>ID Venta</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Monto Total</TableCell>
              <TableCell align="center">Pago</TableCell>
              <TableCell align="center">Comprobante</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map(function (venta) {
              return <FilaVenta key={venta.id_venta} venta={venta} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}