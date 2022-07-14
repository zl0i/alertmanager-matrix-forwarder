FROM node:16.13.2-alpine
ENV APP_PORT="3000"
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:16.13.2-alpine as runner
ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./
RUN npm ci
CMD npm start
