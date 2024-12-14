import {environment} from '@environments/environment'
import {OktaConfig} from '@okta/okta-angular'
import OktaAuth, {OktaAuthOptions} from '@okta/okta-auth-js'

const oktaAuthOptions: OktaAuthOptions = {
    issuer: `https://${environment.OKTA_DOMAIN}/oauth2/default`,
    clientId: `${environment.OKTA_CLIENT_ID}`,
    redirectUri: `${window.location.origin}/login/callback`
}
const oktaAuth = new OktaAuth(oktaAuthOptions);
export const oktaModuleConfig: OktaConfig = { oktaAuth }

