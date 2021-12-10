FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install && npm i -g pm2

COPY . .

EXPOSE 3000

CMD [ "pm2", "start", "ecosystem.config.json", "--no-daemon" ]
