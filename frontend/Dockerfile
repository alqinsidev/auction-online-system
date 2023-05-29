# Use an official Node.js runtime as a parent image
# FROM --platform=linux/amd64 nginx:stable-alpine
FROM nginx:stable-alpine

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./dist /usr/share/nginx/html
