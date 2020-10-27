FROM node:12-alpine as publicBuilder
WORKDIR /assets
COPY ./assets .
RUN npm i
RUN npm run build

FROM golang:alpine AS builder
ENV GOOS=linux \
    GOARCH=amd64 
    
WORKDIR /Ghostly
COPY . .
COPY --from=publicBuilder /assets /Ghostly/public
RUN go mod download
RUN go get github.com/revel/cmd/revel

RUN revel package ./ prod
RUN tar -xf Ghostly.tar.gz --directory /Ghostly/app

FROM alpine

WORKDIR /dist

COPY --from=builder /Ghostly/app /dist

RUN chmod +x /dist/Ghostly.tar.gz
EXPOSE 9000
ENTRYPOINT ./Ghostly.tar.gz