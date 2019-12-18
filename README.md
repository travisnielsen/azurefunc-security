# Microservices Security Patterns for App Service

This is a demonstration of a proposed architecture for securing a microservices written in Azure Functions. It emphasizes the use of Azure API Management as a centralized conduit for all data access between external requests to services (aka "North-South traffic") as well as inter-service access (aka. "East-West" traffic). The objectices of this architecture is to provide a simplified approach to to security that emphasizes simplicity, supportability, and extensability. Two sample microservices are included in this demonstration, each implemented within its own Azure Function App. Additinoally, sample Azure API Management Policies and other supporting tools are included to provide an end-to-end view.

## Platform Security Controls

Several layers of security have been considered:

* [Mutual TLS](docs/mtls.md)
* Managed Identity
* Monitoring and Diagnostic logs

## Application-specific Security Controls

* Authorization policy endpoint

