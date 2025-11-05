FROM node:24-alpine
COPY . /app
WORKDIR /app
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
