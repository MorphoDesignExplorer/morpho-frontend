# This dockerfile must be built with the monorepo root directory as cwd
FROM node:lts-alpine
WORKDIR /app

#all files needed for the build
COPY package.json .
COPY package-lock.json .
COPY jsconfig.json .
COPY svelte.config.js .
COPY vite.config.js .

#all folders needed for the build
COPY . .

RUN npm i

RUN npm run build

EXPOSE 3000

CMD ["node", "build"]
