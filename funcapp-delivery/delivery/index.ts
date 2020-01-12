import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as msRestAzure from "ms-rest-azure"
import * as request from "request"
import { access } from "fs";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const orders = req.query.orders;

    if (orders) {
        if (orders === "create" || orders === "get") {
            let credentials = await getCredentials(process.env.TOKEN_AUDIENCE);
            processOrders(orders, credentials);

            context.res = {
                // status: 200, /* Defaults to 200 */
                body: "Executing action for 'orders': " + orders + ". Please check the logs."
            };
        }
        else {
            context.res = {
                status: 400,
                body: "Values to the 'orders' query string must be 'create' or 'get'"
            };
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass 'oders=get|create' in the query string."
        };
    }

};

async function processOrders(action, credentials) {

    var requestMethod = "get";
    if (action == "create") {
        requestMethod = "POST";
    }

    credentials.getToken(function(err, tokenResponse) { 
        
        // *DEMO PURPOSES ONLY* NEVER EMIT AN ACCESSTOKEN IN A REAL ENVIRONMENT
        console.warn("!!DEMO PURPOSES ONLY!! *NEVER* EMIT AN ACCESSTOKEN IN A REAL ENVIRONMENT");
        console.info("Access token: " + tokenResponse.accessToken);

        var options = {
            method: requestMethod,
            url: process.env.ORDER_API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${tokenResponse.accessToken}`,
                'Ocp-Apim-Subscription-Key': '67f3d2869d7e49dcbfa803e84c19340f'
            }
        }

        function callback(error, response, responseBody) {
            if (!error && response.statusCode == 200) {
                console.info("Response: " + responseBody);
            }
            if (response.statusCode == 401) {
                console.warn("Response: " + responseBody);
            }
            if (error) {
                console.error("Response: " + responseBody);
            }
        }
    
        request(options, callback);

    });

}

async function getCredentials(audience) {

    var accessToken;

    if (process.env.APPSETTING_WEBSITE_SITE_NAME){
        // Use Managed Identity
        return msRestAzure.loginWithAppServiceMSI({resource: audience })
    } else {
        // Use test Service Principal
        let clientId = process.env.CLIENT_ID;
        let secret = process.env.CLIENT_SECRET;
        let domain = process.env.CLIENT_TENANT;
        
        return msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, {tokenAudience: audience });        
    }
};


export default httpTrigger;
