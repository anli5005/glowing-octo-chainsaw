import React, { useEffect, useState } from 'react';
import { Grommet, Grid, Box, Main, grommet, Tabs, Tab, Heading, Paragraph } from 'grommet';
import { deepMerge } from 'grommet/utils';
import styled from 'styled-components';
import auth from './auth';
import samples from './samples.json';
import EmailList from './EmailList';

const FillGrommet = styled(Grommet)`
  height: 100%;
  width: 100%;
`;

const FillGrid = styled(Grid)`
  height: 100vh;
  overflow: hidden;
`;

const FillHeading = styled(Heading)`
  max-width: none;
`;

const theme = deepMerge(grommet, {
  global: {}
});

function App() {
  /* useEffect(() => {
    async function fetchData() {
      console.log((await auth.getAccessToken()).accessToken);
    }

    fetchData();
  }); */

  const [email, setEmail] = useState(null);

  return (
    <FillGrommet theme={theme}>
      <Grid columns={["medium", "flex"]} fill="vertical">
        <Box background="light-3" pad={{top: "small"}} overflow="auto" height="100vh">
          <Tabs>
            <Tab title="Samples">
              <Box fill="vertical" flex="grow" overflow="auto">
                <EmailList emails={samples} selectEmail={setEmail} />
              </Box>
            </Tab>
            <Tab title="Inbox">Inbox</Tab>
          </Tabs>
        </Box>
        <FillGrid rows={["flex", "small"]}>
          <Main pad="medium" fill="horizontal">
            {email ? <React.Fragment>
              {email.subject ? <FillHeading level={3}>{email.subject}</FillHeading> : <Heading level={3} color="status-unknown">(no subject)</Heading>}
              <Paragraph fill="horizontal">{email.text}</Paragraph>
            </React.Fragment> : <Heading level={3} color="status-unknown">Select an email to analyze it</Heading>}
          </Main>
          <Box background="light-1">Box!</Box>
        </FillGrid>
      </Grid>
    </FillGrommet>
  );
}

export default App;
