---
title: Docker
slug: "/docker"
order: 4
description: Docker cheat sheet
---

## Containers

```bash
# docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
docker run  \
    --name myDB \
    --entrypoint /bin/sh \          # override entrypoint
    -p 8080:80 \                    # hostPort:containerPort
    -v data_volume:/var/lib/mysql   # volumeName:containerPath
    -v /User/alex:/home/alex/app    # hostPath:containerPath
    -e USERNAME='alex' \  		    # env variables
    -e PASSWORD='foo'  \
    -d  \                           # detached mode
    -it \                           # interactive mode
    --rm \                          # Automatically remove when it exits
    mysql \                         # image
    /bin/sh                         # command

docker container exec -it web bash
docker container ls
docker stop containerID
docker rm containerID
docker logs containerID
docker top containerID
docker inspect containerID
docker ps

docker container rm -f $(docker ps -aq)   # Delete all stopped containers
docker system prune                       #Remove unused containers,networks, images
```

## Images

```bash
docker build -t mambalex/newImg:1.0.0 .
docker login --username mambalex
docker push mambalex/newImg:1.0.0
docker pull myImage:1.0
```

## Dockerfiles

```dockerfile
FROM ubuntu:2.1.1

WORKDIR /myapp          # Create app directory
ENV APP_HOME /myapp
COPY package*.json ./   # Cache dependencies
RUN npm install  #Each instruction creates a new image layer
COPY . .

RUN deluser --remove-home node \
  && addgroup -S node -g 999 \
  && adduser -S -G node -u 999 node

USER node

# Optional, it's a way of documenting.
# Will work regardless of whether or not you expose it
EXPOSE 8080

ENTRYPOINT["node", "server.js"]
CMD ["5"]           # CMD appends to ENTRYPOINT

```

<br>

```dockerfile
# Go
FROM golang:1.13-alpine3.11 as builder

WORKDIR /build

COPY go.mod  go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main

# Multistage
FROM scratch
COPY --from=builder /build/main  /
ENTRYPOINT [ "/main" ]
```

<br>

```dockerfile
# Java
FROM openjdk:8-jre-alpine

WORKDIR /usr/app

COPY app.jar /usr/app

ENTRYPOINT ["java", "-jar", "/usr/app/app.jar"]
```
