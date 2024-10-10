import * as awsSdk from 'aws-sdk';
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

