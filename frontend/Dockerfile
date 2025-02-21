# frontend/Dockerfile
FROM node:16

WORKDIR /frontend

COPY package.json .
# COPY package-lock.json .
RUN npm install

COPY . .

CMD ["npm", "start"]