import { MsalAuthProvider, LoginType } from 'react-aad-msal';

const config = {
    auth: {
        authority: "https://login.microsoftonline.com/763dfca2-246a-42bb-aed8-2778961350e2",
        clientId: "2073bcb8-7009-43bb-955d-ddef504dd450",
        redirectUri: "http://localhost:3000"
    },
    cache: {
        cacheLocation: "localStorage"
    }
};

const authenticationParameters = {
    scopes: [
        "user.read",
        "mail.read"
    ]
};

const options = {
    loginType: LoginType.Popup,
    tokenRefreshUri: window.location.origin
}

export default new MsalAuthProvider(config, authenticationParameters, options);