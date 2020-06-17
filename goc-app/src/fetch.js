import auth from './auth';

const parser = new DOMParser();

function stripTags(str) {
    let doc = parser.parseFromString(str, "text/html");
    return doc.body.innerText.split(/From: [^ ]/)[0];
}

export default async function(url) {
    const {accessToken} = await auth.getAccessToken();
    const response = await fetch(url || "https://graph.microsoft.com/v1.0/me/mailFolders('Inbox')/messages?$select=subject,body&$top=40", {
        headers: {Authorization: `Bearer ${accessToken}`}
    });
    const json = await response.json();
    return {emails: json.value.map(({id, subject, body: {content}}) => ({
        id,
        subject,
        text: stripTags(content)
    })), more: json["@odata.nextLink"]};
}