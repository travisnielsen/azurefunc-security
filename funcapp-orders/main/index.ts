import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createApp } from '../src/main.azure';

export default function(context: Context, req: HttpRequest): void {

  console.info("Orders API invoked")

  if (process.env['X-MS-CLIENT-PRINCIPAL-NAME']) {
    console.info("App Service AAD Authorization is enabled. Header values:")
    console.info("X-MS-CLIENT-PRINCIPAL-NAME: " + process.env['X-MS-CLIENT-PRINCIPAL-NAME']);
    console.info("X-MS-CLIENT-PRINCIPAL-ID: " + process.env['X-MS-CLIENT-PRINCIPAL-ID']);
    console.info("X-MS-TOKEN-AAD-ID-TOKEN: " + process.env['X-MS-TOKEN-AAD-ID-TOKEN']);
    console.info("X-MS-TOKEN-AAD-ACCESS-TOKEN: " + process.env['X-MS-TOKEN-AAD-ACCESS-TOKEN']);
    console.info("X-MS-TOKEN-AAD-EXPIRES-ON: " + process.env['X-MS-TOKEN-AAD-EXPIRES-ON']);
  }
  
  AzureHttpAdapter.handle(createApp, context, req);
}
