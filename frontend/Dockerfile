# --- Stage de compilation de Vue.js ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des configurations package.json et package-lock.json
COPY package*.json ./
RUN npm ci

# Copie du reste du code source et build de l'application
COPY . .
RUN npm run build

# --- Stage d'exécution avec Nginx ---
FROM nginx:1.25-alpine

# Remplacement de la configuration par défaut de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie du build statique du frontend dans le dossier public de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
