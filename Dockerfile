FROM node:19-alpine3.16 as base
WORKDIR /src/app
COPY package*.json /
RUN npm install -g @nestjs/cli
EXPOSE 80

FROM base as production
ENV NODE_ENV=production
RUN npm install --force
COPY . /
CMD ["npm", "start:prod"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install --force
COPY . /
CMD ["npm", "start:dev"]