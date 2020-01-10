# Platform Configuration Standards

Components in this section represent the security baseline for Azure Infrastructure that will support a microservices-orineted architecture. [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview) is used as the centralized mechanism for the definition and enforcement of configuration standards.

## Sample Policies

The following sample policies included in this repository.

### Compute: Common Settings


### Compute: App Services


### Compute: App Services Environment (ASE)


### Other: Supporting Azure Services


## Deployment

## Functions Premium

Run the following command to deploy the sample Function Apps

```bash
az login
az group create -l centralus -n functest
az group deployment create --resource-group functest --template-file scripts/functionapp.json
```

## App Service Environment

TBD