FROM node:18.17.1
WORKDIR /app 
COPY package*.json ./
RUN yarn install
COPY . .  
RUN yarn dev
EXPOSE 5000
CMD ["yarn", "dev"]   