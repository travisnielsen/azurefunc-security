import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express'
import { pki, md, asn1 } from 'node-forge'

@Injectable()
export class MtlsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    
    let cert = req.headers['x-arr-clientcert'];

    try {
        // Load certificate validation config
        if (!cert) throw new Error('No certificate in header: x-arr-clientcert');
        if (!process.env['CERT_THUMBPRINT']) throw new Error('Environment variable for certificate thumbprint not set.');
        if (!process.env['CERT_ISSUER']) throw new Error('Environment variable for certificate issuer not set.');
        if (!process.env['CERT_SUBJECT']) throw new Error('Environment variable for certificate subject not set.');
        let certThumbprint = process.env['CERT_THUMBPRINT'].toLowerCase();
        let certIssuer = process.env['CERT_ISSUER'].toLowerCase();
        let certSubject = process.env['CERT_SUBJECT'].toLowerCase();

        // Convert from PEM to pki.CERT
        const pem = `-----BEGIN CERTIFICATE-----${cert}-----END CERTIFICATE-----`;
        const incomingCert = pki.certificateFromPem(pem);
        const fingerPrint = md.sha1.create().update(asn1.toDer((pki).certificateToAsn1(incomingCert)).getBytes()).digest().toHex();
        const currentDate = new Date();

        // Certificate validity checks
        if (currentDate < incomingCert.validity.notBefore || currentDate > incomingCert.validity.notAfter) throw new Error('Failed certificate duation validity check.');
        if (fingerPrint.toLowerCase() !== certThumbprint) throw new Error('Failed certificate thumbprint check.');
        if (incomingCert.issuer.getField('CN').value.toLowerCase() !== certIssuer) throw new Error('Failed certificate issuer check.');
        if (incomingCert.subject.getField('CN').value.toLowerCase() !== certSubject) throw new Error('Failed certificate subject check.');

    } catch (e) {
        if (e instanceof Error) {
            res.status(401).json(e.message).send();
        } else {
            next();
        }
    }

    next();
  }

}