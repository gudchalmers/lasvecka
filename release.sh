# Frontend
docker build --tag lasvecka_frontend:latest -f ./lasvecka-react/prod.Dockerfile ./lasvecka-react
docker tag lasvecka_frontend:latest flakt/lasvecka_frontend:latest
docker push gudchs/lasvecka_frontend:latest

# Backend
docker build --tag lasvecka_backend:latest -f ./lasvecka-python/dev.Dockerfile ./lasvecka-python
docker tag lasvecka_backend:latest flakt/lasvecka_backend:latest
docker push gudchs/lasvecka_backend:latest
