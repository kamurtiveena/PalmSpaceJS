# PalmSpaceJS
Prototype for conducting user studies for hand interactions via browser and webcam.

- install typescript globally
    - `sudo npm i -g typescript`

- generate tsconfig.json
    - `tsc --init`

- generate `eslint.json`
    - `./node_modules/.bin/eslint --init`


TODO:
- try loading gif 
https://www.digitalocean.com/community/tutorials/introduction-to-computer-vision-in-javascript-using-opencvjs


MariaDB in docker
docker run -p 3306:3306 -d --name docker-mariadb -e MYSQL_ROOT_PASSWORD=password mariadb:
docker inspect docker-mariadb | grep 'IPAddress'
docker exec -it docker-mariadb /bin/bash
mariadb -u root -p
CREATE DATABASE prantordb;
CREATE TABLE prantordb.desserts (name VARCHAR(100));
INSERT INTO prantordb.desserts VALUES ('churros'), ('gelato'), ('halo-halo'), ('mochi');


curl requests
curl localhost:3000/desserts
curl -X POST localhost:3000/create/users