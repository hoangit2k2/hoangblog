FROM node:18.17.1
WORKDIR /app 
COPY package*.json ./
RUN yarn install
COPY . .  
RUN yarn run build
EXPOSE 5000
CMD ["yarn", "start"]   