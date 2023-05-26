FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN yarn && yarn build

ENTRYPOINT [ "node_modules/pm2/bin/pm2", "start", "--no-daemon", "ecosystem.config.js"]