FROM node:12-alpine
COPY . /app
WORKDIR /app
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
