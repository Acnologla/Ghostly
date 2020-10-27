FROM node:12-alpine as publicBuilder
WORKDIR /build
COPY ./assets .
RUN npm i
RUN npm run build

FROM golang:alpine AS builder
ENV GOOS=linux \
    GOARCH=amd64

WORKDIR /build
COPY . .
COPY --from=publicBuilder /build/public /build/public
RUN go mod download
RUN go get github.com/revel/cmd/revel

RUN revel package github.com/acnologla/Ghostly prod
RUN tar -xf Ghostly.tar.gz --directory /build/app

FROM alpine

WORKDIR /dist

COPY --from=builder /build/app /dist

RUN chmod +x /dist/Ghostly.tar.gz
EXPOSE 9000
ENTRYPOINT ./Ghostly.tar.gz