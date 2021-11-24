FROM node:fermium-alpine

WORKDIR /usr/src/app

EXPOSE 3000

RUN apk add --update python make g++\
  && rm -rf /var/cache/apk/*

COPY ./package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
