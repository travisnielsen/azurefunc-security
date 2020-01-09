# Application Security Design

## Deployment (Functions Premium)

Run the following command to deploy the sample Function Apps

```bash
az login
az group create -l centralus -n functest
az group deployment create --resource-group functest --template-file scripts/functionapp.json
```

## Deployment (App Service Environment)