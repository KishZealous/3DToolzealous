import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    identityPoolId: 'ap-south-1:56e43cb9-9b88-4ddf-b2b2-183c2ed99eab',
    region: 'ap-south-1',
    mandatorySignIn: false, // Optional but recommended
  },
  Storage: {
    AWSS3: {
      bucket: 'zspace-demo',
      region: 'ap-south-1',
    }
  }
});

console.log("Amplify Configured Successfully");