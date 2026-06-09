# Proyecto: Desarrollo Web Backend (TAW-251)

**Universitario:** Luis Alberto Cabrera Quispe  
**Materia:** Desarrollo Web Backend  
**Sigla:** TAW-251  

---

## Requisitos de Estructura (Render)
* **Repositorio único:** Por requerimientos de la plataforma Render, tanto el proyecto *frontend* como el *backend* deben coexistir dentro del mismo repositorio de Git.
* **Instalación de dependencias:** Asegúrate de instalar las librerías del archivo `package.json` ejecutando los comandos de instalación de manera independiente dentro de la carpeta correspondiente de cada proyecto.

---

## Instrucciones para Ejecución Local

Sigue estos pasos para configurar y correr el proyecto en tu entorno local:

### 1. Configuración del Frontend
1. Dirígete a la ruta: `src/config/axios.txs`.
2. Modifica la propiedad `baseURL`.
3. Coloca la URL completa de tu backend local.
   * *Ejemplo (NestJS por defecto):* `http://localhost:3000`

### 2. Configuración del Backend
1. Dirígete a la ruta del backend: `app.module.ts`.
2. Actualiza las credenciales de conexión a la base de datos con tus datos locales.
3. Modifica la propiedad `ssl` (requerida solo para la base de datos en línea de Supabase):
   * **Comenta** o **elimina** la propiedad `ssl` para evitar errores en local.
