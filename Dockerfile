FROM node:18.17.1
WORKDIR /app 
COPY package*.json ./
RUN yarn install
COPY . .  
RUN yarn start
EXPOSE 5000
CMD ["yarn", "start"]   