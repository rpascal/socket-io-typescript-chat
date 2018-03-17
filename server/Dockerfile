FROM node:9.8.0

WORKDIR /server
COPY ["package*.json", "./"]
RUN npm cache clean --force
RUN npm install
COPY . .
RUN npm install -g gulp-cli
RUN gulp build

CMD npm start