FROM 10.114.134.52:6060/node:9.2
 
RUN mkdir -p /home/www/express
WORKDIR /home/www/express
 
COPY . /home/www/express
 
RUN npm install
 
#EXPOSE 3000
 
ENTRYPOINT ["npm", "run"]
CMD ["start"]