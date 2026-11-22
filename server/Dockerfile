FROM node:24-alpine
COPY . /app
WORKDIR /app
RUN npm install --omit=dev
EXPOSE 6451
ENV HOST=0.0.0.0
CMD ["bin/u-wave-hub.js"]
