FROM node:latest

WORKDIR /dockerProj
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "file2.js"]