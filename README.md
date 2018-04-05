Docker Socket.io Chat
=========================================

# Prerequisites

First, ensure you have the following installed:

1. NodeJS - Download and Install latest version of Node: [NodeJS](https://nodejs.org)
2. Git - Download and Install [Git](https://git-scm.com)
3. Angular CLI - Install Command Line Interface for Angular [https://cli.angular.io/](https://cli.angular.io/)
4. Docker - Download and Install latest version of Docker: [Docker](https://www.docker.com/)

After that, use `Git bash` to run all commands if you are on Windows platform.

# Clone repository

In order to start the project use:

```bash
$ git clone https://github.com/rpascal/socket-io-typescript-chat.git
$ cd socket-io-typescript-chat
```


# Running Server and Client in Docker

To start up docker run the following command.

```bash
$ docker-compose up --build
```

## Reset Docker/Containers
Sometimes it is good to either reset the containers or all of Docker

To reset Containers:

```bash
$ sudo bin/resetContainers.sh
```

To reset Docker: (ie: delete images, delete containers, start up)

```bash
$ sudo bin/resetDocker.sh
```

# Running Server and Client locally

## Run Server

To run server locally, just install dependencies and run `gulp` task to create a build:

```bash
$ cd server
$ npm install -g gulp-cli
$ npm install
$ gulp build
$ npm start
```

The `socket.io` server will be running on port `8080`

## Run Angular Client

Open other command line window and run following commands:

```bash
$ cd client
$ npm install
$ ng serve
```

Now open your browser in following URL: [http://localhost:4200](http://localhost:4200/)

# Forked
Forked from <a href="https://github.com/luixaviles/socket-io-typescript-chat">luixaviles</a>

## License

MIT
