import React from 'react';
import { List } from 'grommet';

export default function EmailList({emails, selectEmail}) {
    return <List primaryKey="subject" data={emails.map(({subject}, index) => ({subject: subject || "(no subject)", index}))} onClickItem={({index}) => {
        selectEmail(emails[index]);
    }} />;
}