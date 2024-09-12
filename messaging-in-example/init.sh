sudo mkdir -p ./data;
sudo chmod 777 -R ./data;
docker-compose up -d;
docker-compose -f nat-js-compose.yaml up -d;
