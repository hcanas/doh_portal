FROM node:lts-alpine

WORKDIR /var/www/app

COPY package*.json ./
RUN npm install

COPY . .