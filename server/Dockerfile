FROM node:24-alpine
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 6451
CMD ["bin/u-wave-hub.js"]
