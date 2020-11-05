#!/bin/bash

cwd=$(cd "$(dirname "$0")";pwd)
echo $cwd
echo "***************** Begin to install Om Server ********************"

echo "******************* Copy mysql config **************************"
mkdir -p /mysqlom/data/
mkdir -p /mysqlom/conf/
mkdir -p /mysqlom/init/
cp config/my.cnf /mysqlom/conf/

echo "****************** Copy mysql init sql *************************"
cp -r sql/. /mysqlom/init/

echo "************************ mysql Pod start *****************************"
docker-compose -f docker-compose.yml up -d
