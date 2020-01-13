# Application Security Design - Service-to-service authorization

Microservices hosted in Azure Function Apps will be secured using OAuth API scopes, which are defined in Azure Active Directory and granted to Managed Identities (service principals). All inter-service communication flows through Azure API Management (APIM), which takes the responsibility of validating tokens and performing any additional policy checks before forwarding the request to the published API.

<img src="img/s2s-oauth.png" width="700"/>

This approach allows for centralized, auditable assignment of application roles (scopes) and the use of industry-standard techniques for the enforcement of authorization within APIs. Through the use of APIM as a gateway, supplimental access policy checks can be added without increasing complexity for developers. Furthermore, APIM capabilies such as caching and Application Insights integration can be used to provide additional benefits for observability and performance.

## Configure Service Identities and Permissions

> This section includes steps for configuring API access control, which is managed via Azure Active Directory. The user performing these actions must have these permissions in order to execute the following steps.

Services calling other services must first acquire an access token using its own [Function App Managed Identity (system assigned)](https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=dotnet). It is assumed that both the **orders** and **delivery** Function Apps have been deployed as documented in the [Platform Configuration Standards guide](1-plat-configstds.md).

### Enable Managed Identity and document the 'objectid'

First, enable the System Managed Identity on **delivery** Function App. This can be done via the Azure Portal or via the CLI.

```bash
az functionapp identity assign -g funcdemo -n <function-app-name>
```

Next, you will need to document the Object ID of the service principal linked to the Managed Identity.

```bash
az ad sp list --display-name <function-app-name> --query '[].{name:appDisplayName,objectId:objectId}' -o tsv
```

Save the GUID for the entry that matches the name of your *delivery* Function App.

### Create Service Principal for local testing

Create a Service Principal if you need to test locally:

```bash
az ad sp create-for-rbac -n "delivery-testsp" --skip-assignment
```

Make sure you save the output information for future reference. Finally, run the following command to get the ObjectID of the test Service Principal:

```bash
az ad sp list --display-name 'delivery-testsp' --query '[].{name:appDisplayName,objectId:objectId}' -o tsv
```

### Register API, define and assign permissions

In order to establish OAuth-based API security services deployed to the **orders** Function App, it must be registered in Azure Active Directory as an application. To do so, use the following CLI command:

```bash
az ad app create --display-name svc-orders --identifier-uris 'api://svc-orders'
```

Ensure the app has a *service principal* that can be associated to this app. This can be confirmed in portal by looking at the Overivew tab of the app in Azure Active Directory. In the "Managed application in local directory" field, confirm it has a value. If it lists "Create Service Principal", click the link to create it. Document the object ID of the app's associated *service principal* (not the object ID of the app) for use later.

Next, the various permissions the profile service hosts must be defined. This is done by updating the 'appRoles' section of the application manifest for *svc-profile* in the Portal.

```json
{
  "appRoles": [
    {
      "allowedMemberTypes": [
        "Application"
      ],
      "displayName": "Read Orders",
      "id": "a875db13-c9a3-46ed-9eca-423d5e4169cd",
      "isEnabled": true,
      "description": "Allow the application to read order information.",
      "value": "Orders.Read"
    }
  ]
}
```

Finally, execute the following command to link the Managed Identity of the *delivery* Function App to the Orders API.

```powershell
New-AzureADServiceAppRoleAssignment -ObjectId <delivery-sp-objectid> -PrincipalId <delivery-sp-objectid> -Id <orders-approle-id> -ResourceId <orders-app-serviceprincipal-objectid>
```

If with to assign permission to the API scope to a test service principal, execute the same command but with the Object ID of the test service principal 

## Add token validation and access control checks to API Management

In API Management, navigate to the Orders API. Ensure the **getOrders** operation is highlighted and click the XML edit button to update the policy at **Inbound processing**. Add the following XML within the `<inbound>` element.

```XML
<inbound>
  <base/>
  <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
      <openid-config url="https://sts.windows.net/<your-tenant-ID>/.well-known/openid-configuration" />
      <required-claims>
          <claim name="aud" match="all">
              <value>api://svc-orders</value>
          </claim>
          <claim name="roles" match="any">
              <value>Orders.Read</value>
          </claim>
      </required-claims>
  </validate-jwt>
</inbound>
```

Next, do the same for the **createOrder** operation and update the policies in the `<inbound>` section of the XML as follows.

```XML
<inbound>
    <base />
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
        <openid-config url="https://sts.windows.net/<your-tenant-ID>/.well-known/openid-configuration" />
        <required-claims>
            <claim name="aud" match="all">
                <value>api://svc-orders</value>
            </claim>
            <claim name="roles" match="any">
                <value>Orders.Create</value>
            </claim>
        </required-claims>
    </validate-jwt>
</inbound>
```

Once implemented this way in APIM, only AAD-registered applications with valid access tokens that have a matching audience (aud) claim as well as the required application role can make the call.

## Restrict Inbound connections to the APIM Managed Identity on Function Apps

As indicated in Step 5 of the above diagram, APIM's Managed Identity can be used as an alternative to 