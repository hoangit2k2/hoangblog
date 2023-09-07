FROM node:18.17.1
WORKDIR /app 
COPY package*.json ./
RUN yarn install
COPY . .  
RUN pm2 start app.js
EXPOSE 5000
CMD ["pm2", "start", "app.js"]   