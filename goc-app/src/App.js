import React, { useEffect, useState } from 'react';
import { Grommet, Grid, Box, Main, grommet, Tabs, Tab, Heading, Paragraph } from 'grommet';
import { deepMerge } from 'grommet/utils';
import styled from 'styled-components';
import samples from './samples.json';
import EmailList from './EmailList';
import auth from './auth';
import analyze from './analyze';
import fetchData from './fetch';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import AnalysisView from './AnalysisView';
import FancyButton from './FancyButton';

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

const Content = styled(Paragraph)`
  white-space: pre-line;
`;

const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: "#4272f5",
      "graph-1": "accent-4",
      "graph-2": "status-warning",
      "graph-3": "status-critical"
    }
  },
  button: {
    default: {
      color: "brand",
      background: {
        color: "brand",
        opacity: 0.3
      }
    },
    primary: {
      color: "white",
      background: {
        color: "brand"
      }
    }
  },
  tab: {
    active: {
      color: "brand",
      extend: {
        fontWeight: "bold"
      }
    },
    color: "#c4d4ff",
    border: {
      color: {
        light: "#c4d4ff"
      },
      active: {color: {light: "brand"}}
    }
  }
});

function App() {
  const [email, setEmail] = useState(null);
  const [inbox, setInbox] = useState({emails: [], more: null});
  const [refreshing, setRefreshing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  async function refresh() {
    setRefreshing(true);
    setInbox(await fetchData());
    setRefreshing(false);
  }

  useEffect(() => {
    if (auth.authenticationState === AuthenticationState.Authenticated) {
      refresh();
    } else {
      setInbox({emails: [], more: null});
    }
  }, [loggedIn]);

  return (
    <FillGrommet theme={theme}>
      <Grid columns={["medium", "flex"]} fill>
        <Box background="light-1" pad={{top: "small"}} overflow="auto" height="100vh" border="right">
          <Tabs>
            <Tab title="Samples">
              <Box fill="vertical" flex="grow" overflow="auto" margin={{top: "small"}}>
                <EmailList emails={samples} selectEmail={setEmail} selectedId={email && email.id} />
              </Box>
            </Tab>
            <Tab title="Inbox">
              <AzureAD provider={auth}>
                {
                  ({login, authenticationState, logout}) => {
                    if (authenticationState === AuthenticationState.Authenticated) {
                      setLoggedIn(true);
                      return (
                        <React.Fragment>
                          <Box direction="row" align="center" justify="center" margin={{vertical: "medium"}}>
                            <FancyButton primary onClick={() => refresh()} disabled={refreshing}>Refresh</FancyButton>
                            <FancyButton margin={{left: "medium"}} onClick={logout}>Log Out</FancyButton>
                          </Box>
                          <Box fill="vertical" flex="grow" overflow="auto">
                            <EmailList emails={inbox.emails} selectEmail={setEmail} selectedId={email && email.id} />
                          </Box>
                        </React.Fragment>
                      );
                    } else {
                      setLoggedIn(false);
                      return <Box align="center" justify="center" margin={{vertical: "large"}}>
                        <FancyButton primary onClick={login} disabled={authenticationState === AuthenticationState.InProgress}>Sign in with Outlook</FancyButton>
                      </Box>
                    }
                  }
                }
              </AzureAD>
            </Tab>
          </Tabs>
        </Box>
        <FillGrid rows={["flex", "300px"]}>
          <Main pad="medium" fill="horizontal">
            {email ? <React.Fragment>
              {email.subject ? <FillHeading level={3}>{email.subject}</FillHeading> : <Heading level={3} color="status-unknown">(no subject)</Heading>}
              <Content margin={{top: "medium"}} fill>{email.text}</Content>
            </React.Fragment> : <Heading level={3} color="status-unknown">Select an email to analyze it</Heading>}
          </Main>
          <Box background="light-1" overflow="auto" border="top">
            {email && <React.Fragment>
              <Box>
                {email.analysis && <AnalysisView analysis={email.analysis} />}
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
