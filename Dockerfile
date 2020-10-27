FROM golang:alpine AS builder
ENV GOOS=linux \
    GOARCH=amd64

WORKDIR /build

COPY go.mod .
RUN go mod download
RUN go get github.com/revel/cmd/revel


COPY . .
RUN revel package github.com/acnologla/Ghostly prod
RUN tar -xf Ghostly.tar.gz --directory /build/app

FROM alpine

WORKDIR /dist

COPY --from=builder /build/app /dist

RUN chmod +x /dist/Ghostly.tar.gz

ENTRYPOINT ./Ghostly.tar.gz