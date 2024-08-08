FROM --platform=linux/amd64 node:20-alpine
RUN mkdir -p /opt/aml-api-service
COPY ./aml-api-service  ./opt/aml-api-service
WORKDIR /opt/aml-api-service
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]