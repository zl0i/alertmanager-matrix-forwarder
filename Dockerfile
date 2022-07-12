FROM node:16.13.2-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN ["npm", "build"]


FROM node:16.13.2-alpine as runner
ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app
COPY --from=builder /app/dist ./
RUN npm ci
CMD ["npm", "start"]
