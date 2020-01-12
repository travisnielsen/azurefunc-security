# Platform Configuration Standards

Components in this section represent the security baseline for Azure Infrastructure that will support a microservices-orineted architecture. [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview) is used as the centralized mechanism for the definition and enforcement of configuration standards.

## Sample Policies

The following sample policies included in this repository.

### Compute: Common Settings


### Compute: App Services


### Compute: App Services Environment (ASE)


### Other: Supporting Azure Services


## Deployment

Once configuration standards are defined

### Functions Premium

Run the following command to deploy the Orders and Delivery sample Function Apps. Both Function Apps will be deployed to the same App Service Premium Plan called `funcdemo`.

```bash
az login
az group create -l centralus -n functest1
az group deployment create --resource-group functest1 --template-file deployments/functionapp.json --parameters '{ "appName": { "value": "trnielordersvc"} }'
az group deployment create --resource-group functest1 --template-file deployments/functionapp.json --parameters '{ "appName": { "value": "deliverysvc"} }'

```

### App Service Environment (ASE)

Please see [these instructions](https://docs.microsoft.com/en-us/azure/app-service/environment/create-ilb-ase) for deploying an ILB ASE. Once the ASE is fully configured, use the following script to deploy the Orders and Delivery sample Function Apps.

> SCRIPT TBD

### Azure API Management

Please see [this sample](https://github.com/Azure/azure-quickstart-templates/tree/master/101-azure-api-management-create) for deploying an APIM instance.

> SCRIPT TBD

Once APIM is deployed, import the sample client certificate provided in the `certs` folder. This can be done by navigating to the Azure Portal and selecting the **Certificates** section. Click **Add** and upload `client-cert.pfx`. The password for this file is: 3@6AagBD

### Deploy code

Use VS Code to publish each Function App in this repository to its respective instance in Azure.

## Configuration

### Add Mutual TLS Settings

The certificate validation is perfomed in the nodejs code and with values provided as environment variables. In the Function App, create the following applicaiton settings. If you are using your own SSL certificate, be sure to replace the below values with yours.

* CERT_ISSUER : `apimanagement`
* CERT_SUBJECT : `apimanagement`
* CERT_THUMBPRINT : `E6EAE966BE935167AF3E41273D1636C4DEAC4B90`
* WEBSITE_NODE_DEFAULT_VERSION : `~12`
* APIM_SUBSCRIPTION_KEY: `<subscription-key>`

For local debugging, you will need to add the same entries to your `local.settings.json` file as shown in this example:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "TOKEN_AUDIENCE": "api://svc-orders",
    "CLIENT_ID": "<your-client-id>",
    "CLIENT_SECRET": "<your-client-secret>",
    "CLIENT_TENANT": "<your-tenant-id>",
    "ORDER_API_URL": "https://trniel.azure-api.net/demo/orders",
    "APIM_SUBSCRIPTION_KEY": "<your-apim-key>"
  },
  "ConnectionStrings": {}
}
```

### Publish APIs

With mTLS enabled witin App Service and middleware enabled to whiltelist only Azure API Management's client certificate, all traffic to and between microservices must flow though APIM. Therefore, each API must be published in APIM so that it can be accessed. APIM then applies various access control checks as discussed in the [Application Security](2-app-security-s2sauthz.md) guide.

In the Azure Portal, navigate to the **APIs** section and then select **Add API**. In the **Add a new API** page, click **OpenAPI**. At the next screen, click the **Select a file** button on the right of the screen and select `swagger-spec.json` located in the `funcapp-orders` directory. For the Display name, enter `Orders`. For **API URL suffix**, enter `demo`.

Next, the backend service needs to be defined. To do this, ensure the **All operations** section is highlighted and click the XML icon in the **Inbound processing** section of the API design page. On the next screen, replace the XML with the following:

```xml
<policies>
    <inbound>
        <base />
        <set-backend-service base-url="https://<your-function-app>.azurewebsites.net/api" />
        <authentication-certificate thumbprint="E6EAE966BE935167AF3E41273D1636C4DEAC4B90" />
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

Be sure to replace `<your-function-app>` with the actual name of the Orders Function App in your environment.
