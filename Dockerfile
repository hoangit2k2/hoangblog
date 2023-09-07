FROM node:18.17.1
WORKDIR /app 
COPY package*.json ./
RUN yarn install
COPY . .  
EXPOSE 5000
CMD ["node", "app.js"]   
RUN docker build -t blog .
RUN docker run -p 3000:3000 -d blog
