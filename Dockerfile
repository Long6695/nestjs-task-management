FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 8888

CMD ["yarn", "start:prod"]