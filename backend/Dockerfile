#build stage
FROM node:18-alpine 

WORKDIR /app

#copy package file
COPY package.json ./

#install dependencies
RUN npm install

#copy application code
COPY . .

#expose port
EXPOSE 8080

#create directory for uploads
RUN mkdir -p public/uploads

#start application
CMD ["npm", "start","dev"]