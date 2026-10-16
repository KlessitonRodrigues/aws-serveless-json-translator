import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { NEXT_STATIC_PATHS, resourceNames } from '../constants/constants.resources';

export class NextDistribution extends cloudfront.Distribution {
  constructor(scope: cdk.Stack, bucket: s3.IBucket, serverUrl: lambda.FunctionUrl) {
    const assetsOrigin = origins.S3BucketOrigin.withOriginAccessControl(bucket);
    const serverOrigin = origins.FunctionUrlOrigin.withOriginAccessControl(serverUrl);

    const staticBehavior: cloudfront.BehaviorOptions = {
      origin: assetsOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      compress: true,
    };

    super(scope, resourceNames.distribution, {
      defaultBehavior: {
        origin: serverOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        // Forward everything except Host, which Function URLs reject
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      },
      additionalBehaviors: Object.fromEntries(NEXT_STATIC_PATHS.map(p => [p, staticBehavior])),
    });
  }
}
