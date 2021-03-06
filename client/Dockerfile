FROM node:9.8.0 as builder

COPY package.json package-lock.json ./

RUN npm set progress=false 
RUN npm config set depth 0 
RUN npm cache clean --force


## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i 
RUN  mkdir /ng-app 
RUN  cp -R ./node_modules ./ng-app


WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --prod

FROM nginx:1.13.9

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]