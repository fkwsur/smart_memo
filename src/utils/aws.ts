import * as awsSdk from 'aws-sdk';
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

export class Aws {
    constructor(
    ){};
    Init = (region: string, accessKey: string, secretKey: string) => {
        awsSdk.config.update({
            region: region,
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        })
    };
    AwsSdk = () => {
        return awsSdk;
    };
    Bucket = ()  => 
    {
        return "testbucket"
    };
}

