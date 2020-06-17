const categories = ["Email Chains", "Announcements", "Lost Items", "Links", "Surveys", "Communication", "Automated Emails", "Administration"];

export default async function({subject, text}) {
    const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({subject, text, include_encoding: true})
    });
    const json = await response.json();

    if (json.ok) {
        const min = json.result.reduce((a, b) => Math.min(a, b));
        const max = json.result.reduce((a, b) => Math.max(a, b));
        return {
            encoding: json.encoding,
            result: json.result.map((value, index) => ({category: categories[index], value}))
                .sort((a, b) => b.value - a.value),
            min,
            max
        };
    } else {
        throw new Error("JSON is not okay");
    }
}