# --- Stage de compilation ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des fichiers de configuration package.json et package-lock.json
COPY package*.json ./
RUN npm ci

# Copie du code source et compilation TypeScript
COPY . .
RUN npm run build

# --- Stage d'exécution en production ---
FROM node:20-alpine
WORKDIR /app

# Installation uniquement des dépendances de production
COPY package*.json ./
RUN npm ci --only=production

# Copie des fichiers compilés depuis le builder
COPY --from=builder /app/dist ./dist

# Variables d'environnement et ports
ENV PORT=3000
EXPOSE 3000

# Lancement de l'application
CMD ["node", "dist/server.js"]
