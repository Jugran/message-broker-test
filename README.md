Microservice architecture to handle high traffic

Checklist:

- [x] database service 
- [x] 2 microservice
- [x] integrate rabbitmq 
- [ ] set consume rate on rabbitmq
- [ ] multiple custers to increase data ingestion with given database bottleneck
- [ ] set rps limit on the api endpoint (user specific)



---



### To Start Selected services
```
docker-compose up -d api queue webserver
```

### To refresh SSl certificate
```
docker-compose up --force-recreate --no-deps certbot
```

### To reload Nginx config
Hard restart whole container
```
docker-compose up -d --force-recreate --no-deps webserver
```

Reload config inside container
```
docker exec -it {container_name} nginx -s reload
```