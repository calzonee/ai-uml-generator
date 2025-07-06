FROM node:20-alpine AS builder

# PlantUML braucht Java + Graphviz
RUN apk add --no-cache openjdk11-jre graphviz curl

WORKDIR /app
COPY package*.json ./
COPY demo.puml ./demo.puml
RUN npm install --production

# PlantUML JAR herunterladen
RUN curl -L "https://github.com/plantuml/plantuml/releases/download/v1.2025.2/plantuml-1.2025.2.jar" \
  -o /usr/local/bin/plantuml.jar

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
