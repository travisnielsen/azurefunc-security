# VARIABLES
MGMT_GROUP=trniel
SUBSCRIPTION_ID=cecea5c9-0754-4a7f-b5a9-46ae68dcafd3

az login

# Update Policy
az policy definition update --name 'network-internalonly-appservices'   \
--rules network-acl-appsvc.json \
--management-group $MGMT_GROUP  \
--display-name 'App Service: Allow only approved internal network access'