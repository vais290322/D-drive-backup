import { Env, StandardCheckoutClient } from 'pg-sdk-node';
import { phonepeDetails } from './credentials';

const { clientId, clientSecret, clientVersion, env } = phonepeDetails;

const phonePeClient = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX,
);

export default phonePeClient;
