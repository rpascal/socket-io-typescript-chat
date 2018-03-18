FROM node:9.8.0

WORKDIR /server
COPY ["package*.json", "./"]
RUN npm cache clean --force & npm i
COPY . .
RUN npm install -g gulp-cli & gulp build

CMD npm start