import React from 'react';
import { List } from 'grommet';

export default function EmailList({emails, selectEmail, selectedId}) {
    return <List
        primaryKey="subject"
        data={emails.map(({subject}, index) => ({subject: subject || "(no subject)", index}))}
        background={emails.map(({id}) => id === selectedId ? "#b3c7ff" : "transparent")}
        onClickItem={({index}) => {
            selectEmail(emails[index]);
        }} />;
}