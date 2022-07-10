FROM node:16.13.2-alpine
ENV APP_PORT="3000"
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
