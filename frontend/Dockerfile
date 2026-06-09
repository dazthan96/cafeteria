# Etapa 1: Compilación del código
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir los archivos con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# AGREGA ESTA LÍNEA INDISPENSABLE:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
