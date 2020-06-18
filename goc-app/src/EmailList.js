import React from 'react';
import { List } from 'grommet';

export default function EmailList({emails, selectEmail, selectedId}) {
    let index = emails.findIndex(email => email.id === selectedId);
    let background = "transparent";
    if (index > 0) {

    }

    return <List
        primaryKey="subject"
        data={emails.map(({subject}, index) => ({subject: subject || "(no subject)", index}))}
        background={emails.map(({id}) => id === selectedId ? "#b3c7ff" : "transparent")}
        onClickItem={({index}) => {
            selectEmail(emails[index]);
        }} />;
}