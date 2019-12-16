// import { pki, md, asn1 } from 'node-forge';
const forge = require('node-forge')

module.exports = async function (context, req) {
    context.log('HTTP trigger with client certificate: ' + req.headers['x-arr-clientcert']);
    var validationResult = validateCert(req.headers['x-arr-clientcert'], context);

    if (validationResult === false) {
        context.res = {
            // status: 401
            status: 401,
            body: "Invalid credentials"
        };
        context.done();
    }
    
    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    } else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

function validateCert(cert, context) {

    // Sample code taken from: https://docs.microsoft.com/en-us/azure/app-service/app-service-web-configure-tls-mutual-auth#nodejs-sample
    
    try {
        // Load certificate validation config
        if (!cert) throw new Error('UNAUTHORIZED. No certificate in header: x-arr-clientcert');
        if (!process.env['CERT_THUMBPRINT']) throw new Error('Environment variable for certificate thumbprint not set.');
        if (!process.env['CERT_ISSUER']) throw new Error('Environment variable for certificate issuer not set.');
        if (!process.env['CERT_SUBJECT']) throw new Error('Environment variable for certificate subject not set.');
        let certThumbprint = process.env['CERT_THUMBPRINT'].toLowerCase();
        let certIssuer = process.env['CERT_ISSUER'].toLowerCase();
        let certSubject = process.env['CERT_SUBJECT'].toLowerCase();

        // Convert from PEM to pki.CERT
        const pem = `-----BEGIN CERTIFICATE-----${cert}-----END CERTIFICATE-----`;
        const incomingCert = forge.pki.certificateFromPem(pem);
        const fingerPrint = forge.md.sha1.create().update(forge.asn1.toDer((forge.pki).certificateToAsn1(incomingCert)).getBytes()).digest().toHex();
        const currentDate = new Date();

        // Certificate validity checks
        if (currentDate < incomingCert.validity.notBefore || currentDate > incomingCert.validity.notAfter) throw new Error('UNAUTHORIZED. Failed duation validity check.');
        if (fingerPrint.toLowerCase() !== certThumbprint) throw new Error('UNAUTHORIZED. Failed thumbprint check.');
        if (incomingCert.issuer.getField('CN').value.toLowerCase() !== certIssuer) throw new Error('UNAUTHORIZED. Failed issuer check.');
        if (incomingCert.subject.getField('CN').value.toLowerCase() !== certSubject) throw new Error('UNAUTHORIZED. Failed subject check.');

    } catch (e) {
        context.log.error(e.message);
        return false;
    }

    return true;
}