import React, { useEffect, useState } from 'react';
import { Grommet, Grid, Box, Main, grommet, Tabs, Tab, Heading, Paragraph, Button } from 'grommet';
import { deepMerge } from 'grommet/utils';
import styled from 'styled-components';
import samples from './samples.json';
import EmailList from './EmailList';
import fetchData from './fetch';
import analyze from './analyze';

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

const FancyButton = styled(Button)`
  font-weight: bold;
  padding: 0 18px;
`;

const theme = deepMerge(grommet, {
  global: {}
});

function App() {
  const [email, setEmail] = useState(null);
  const [inbox, setInbox] = useState({emails: [], more: null});
  const [refreshing, setRefreshing] = useState(false);
  const [chainsawing, setChainsawing] = useState({});

  async function refresh() {
    setRefreshing(true);
    setInbox(await fetchData());
    setRefreshing(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <FillGrommet theme={theme}>
      <Grid columns={["medium", "flex"]} fill>
        <Box background="light-3" pad={{top: "small"}} overflow="auto" height="100vh">
          <Tabs>
            <Tab title="Samples">
              <Box fill="vertical" flex="grow" overflow="auto">
                <EmailList emails={samples} selectEmail={setEmail} />
              </Box>
            </Tab>
            <Tab title="Inbox">
              <FancyButton primary margin={{left: "medium", vertical: "xsmall"}} onClick={() => refresh()} disabled={refreshing}>Refresh</FancyButton>
              <Box fill="vertical" flex="grow" overflow="auto">
                <EmailList emails={inbox.emails} selectEmail={setEmail} />
              </Box>
            </Tab>
          </Tabs>
        </Box>
        <FillGrid rows={["flex", "medium"]}>
          <Main pad="medium" fill="horizontal">
            {email ? <React.Fragment>
              {email.subject ? <FillHeading level={3}>{email.subject}</FillHeading> : <Heading level={3} color="status-unknown">(no subject)</Heading>}
              <Paragraph fill>{email.text}</Paragraph>
            </React.Fragment> : <Heading level={3} color="status-unknown">Select an email to analyze it</Heading>}
          </Main>
          <Box background="light-1">
            {email && <React.Fragment>
              <Box>
                <FancyButton primary margin="small" disabled={email.chainsawing} onClick={async () => {
                  setEmail(Object.assign({}, email, {chainsawing: true}));
                  setEmail(Object.assign({}, email, {analysis: await analyze(email), chainsawing: false}));
                }}>Analyze</FancyButton>
              </Box>
            </React.Fragment>}
          </Box>
        </FillGrid>
      </Grid>
    </FillGrommet>
  );
}

export default App;
