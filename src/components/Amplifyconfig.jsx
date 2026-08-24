import { Amplify } from 'aws-amplify';

const userPoolId = process.env.REACT_APP_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.REACT_APP_COGNITO_APP_CLIENT_ID;

if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          oauth: {
            domain: process.env.REACT_APP_COGNITO_DOMAIN,
            scopes: ['openid', 'email', 'profile'],
            redirectSignIn: [process.env.REACT_APP_REDIRECT_SIGN_IN],
            redirectSignOut: [process.env.REACT_APP_REDIRECT_SIGN_OUT],
            responseType: 'code',
          },
        },
      },
    },
  });
}

export default Amplify;