import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createApp } from '../src/main.azure';

export default function(context: Context, req: HttpRequest): void {

  console.info("Orders API invoked")

  if (req.headers['x-ms-client-principal-name']) {
    console.info("App Service AAD Authorization is enabled. Header values:")
    console.info("X-MS-CLIENT-PRINCIPAL-NAME: " + req.headers['x-ms-client-principal-name']);
    console.info("X-MS-CLIENT-PRINCIPAL-ID: " + req.headers['x-ms-client-principal-id']);
    console.info("X-MS-TOKEN-AAD-ID-TOKEN: " + req.headers['X-MS-TOKEN-AAD-ID-TOKEN']);
    console.info("X-MS-TOKEN-AAD-ACCESS-TOKEN: " + req.headers['X-MS-TOKEN-AAD-ACCESS-TOKEN']);
    console.info("X-MS-TOKEN-AAD-EXPIRES-ON: " + req.headers['X-MS-TOKEN-AAD-EXPIRES-ON']);
  }

  if (req.headers['X-MS-CLIENT-PRINCIPAL-NAME']) {
    console.info("App Service AAD Authorization is enabled. Header values:")
    console.info("X-MS-CLIENT-PRINCIPAL-NAME: " + req.headers['X-MS-CLIENT-PRINCIPAL-NAME']);
    console.info("X-MS-CLIENT-PRINCIPAL-ID: " + req.headers['X-MS-CLIENT-PRINCIPAL-ID']);
  }
  
  AzureHttpAdapter.handle(createApp, context, req);
}
