import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createApp } from '../src/main.azure';

export default function(context: Context, req: HttpRequest): void {

  console.info("Orders API invoked")

  if (req.headers['x-ms-client-principal-name']) {
    console.info("App Service AAD Authorization is enabled. Header values (lower-case):")
    console.info("x-ms-client-principal-name: " + req.headers['x-ms-client-principal-name']);
    console.info("x-ms-client-principal-id: " + req.headers['x-ms-client-principal-id']);
    console.info("x-ms-token-aad-id-token: " + req.headers['x-ms-token-aad-id-token']);
    console.info("x-ms-token-aad-access-token: " + req.headers['x-ms-token-aad-access-token']);
    console.info("x-ms-token-aad-expires-on: " + req.headers['x-ms-token-aad-expires-on']);
  }

  if (req.headers['X-MS-CLIENT-PRINCIPAL-NAME']) {
    console.info("App Service AAD Authorization is enabled. Header values (upper-case):")
    console.info("X-MS-CLIENT-PRINCIPAL-NAME: " + req.headers['X-MS-CLIENT-PRINCIPAL-NAME']);
    console.info("X-MS-CLIENT-PRINCIPAL-ID: " + req.headers['X-MS-CLIENT-PRINCIPAL-ID']);
    console.info("X-MS-TOKEN-AAD-ID-TOKEN: " + req.headers['X-MS-TOKEN-AAD-ID-TOKEN']);
    console.info("X-MS-TOKEN-AAD-ACCESS-TOKEN: " + req.headers['X-MS-TOKEN-AAD-ACCESS-TOKEN']);
    console.info("X-MS-TOKEN-AAD-EXPIRES-ON: " + req.headers['X-MS-TOKEN-AAD-EXPIRES-ON']);
  }
  
  AzureHttpAdapter.handle(createApp, context, req);
}
