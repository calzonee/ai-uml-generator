FROM node:20-alpine
WORKDIR /app

# Dev-Umgebung
ENV NODE_ENV=development

# Nur package.json kopieren und alle Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Deinen Quellcode
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
