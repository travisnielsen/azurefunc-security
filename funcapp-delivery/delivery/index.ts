import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as msRestAzure from "ms-rest-azure"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));

    if (name) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }

};

function getApiCredentials() {

    let tokenAudience = process.env.TOKEN_AUDIENCE;

    if (process.env.APPSETTING_WEBSITE_SITE_NAME){
        return msRestAzure.loginWithAppServiceMSI({resource: tokenAudience, })
      } else {
        let clientId = process.env.CLIENT_ID;
        let secret = process.env.CLIENT_SECRET;
        let domain = process.env.CLIENT_DOMAIN;
        return msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, {tokenAudience: tokenAudience });
      }



    
}

export default httpTrigger;
