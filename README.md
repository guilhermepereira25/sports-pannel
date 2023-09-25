# Welcome to Sports Pannel

## Description

This is a simple project to use caching concepts with Redis and pure NodeJS. The project is a simple API to get infos from a brazilian league.

## Stacks

![nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) ![vuejs](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)

## Server Setup

Check this [readme](server/README.md) to know how to setup and use the api.

## Client Setup

### At root folder, run the cd command to enter in client folder:

```bash
cd client
```

### Install dependencies

```bash
npm install
```

### Run client

```bash
npm run dev
```

You will probably see the base vite message:

<code>Server running at http://localhost:3001</code>

### Docker 

You can run the client using docker at docker folder. Just run the following command:

```bash
docker-compose up --build -d
```

The client will be running at port 8000.

The server will be running at port 3000.

## External API

This project use the [api-football](https://www.api-football.com/) to get the infos from the brazilian league.

Check their documentation to know how you can use the API in your project.