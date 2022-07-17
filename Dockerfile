FROM node:16.13.2-alpine as builder
WORKDIR /opt/server/
COPY . .
RUN npm ci
RUN npm run build

FROM node:16.13.2-alpine as runner
EXPOSE 3000
WORKDIR /opt/server/
COPY --from=builder /opt/server/package*.json ./
RUN npm i --prod
COPY --from=builder /opt/server/build/ ./
CMD npm run start
