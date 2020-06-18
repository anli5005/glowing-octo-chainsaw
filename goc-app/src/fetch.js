import auth from './auth';

const parser = new DOMParser();

function stripTags(str) {
    let doc = parser.parseFromString(str, "text/html");
    doc.querySelectorAll("style, script").forEach(el => el.parentNode.removeChild(el));
    doc.querySelectorAll("p").forEach(el => el.append("(GLOWING-OCTO-CHAINSAW-NEWLINE)"));
    let text = doc.body.innerText.replace(/\(GLOWING-OCTO-CHAINSAW-NEWLINE\)/g, "\n");
    console.log(text);
    // text = text.split(/From: [^ ]/)[0];
    return text.replace(/<|>/g, "");
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