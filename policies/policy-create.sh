# VARIABLES
MGMT_GROUP=

# az login

# Deploy the policies
# TODO: Dynamically save and use the policy ID URI after creation
az policy definition create --name 'network-internalonly-appservices'    \
 --display-name 'App Service: Allow only approved internal network access' \
 --description 'Enforces App Service instances are in a private configuration with network-level access only to approved IP addresses and Azure subnets'    \
 --mode Indexed  \
 --metadata 'category=security'   \
 --rules network-acl-appsvc-data.json  \
 --params network-acl-appsvc.params.json  \
 --management-group $MGMT_GROUP

# Assign them to a subscription
az policy assignment create --display-name 'App Service: VNET Service Endpoint for data-plane'    \
--scope '/subscriptions/[SUBSCRIPTION_ID]' \
--enforcement-mode Default  \
--policy '/providers/Microsoft.Management/managementgroups/[MGMT_GROUP]/providers/Microsoft.Authorization/policyDefinitions/network-internalonly-appservices'  \
--params '{
    "approvedSubnets": {
        "value": [
            "/subscriptions/[SUBSCRIPTION_ID]/resourceGroups/[NETWORK_RG_ID]/providers/Microsoft.Network/virtualNetworks/[VNET_NAME]/subnets/[SUBNET_NAME]"
        ]
    }
    }'
