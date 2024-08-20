FROM node:18

WORKDIR /ivoz-ui

COPY library/package.json .

RUN yarn install

# Comando para ejecutar la aplicación
CMD ["yarn", "run", "watch"]