Microservice architecture to handle high traffic

Checklist:

- [x] database service 
- [x] 2 microservice
- [x] integrate rabbitmq 
- [ ] set consume rate on rabbitmq
- [ ] multiple custers to increase data ingestion with given database bottleneck
- [ ] set rps limit on the api endpoint (user specific)



---

```
docker-compose --compatibility up -d && docker-compose logs -f -t api queue 
```