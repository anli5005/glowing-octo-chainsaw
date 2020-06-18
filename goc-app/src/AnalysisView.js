import React, { useState } from 'react';
import { Box, Text, Meter, Layer, Grid } from 'grommet';
import styled, { css } from 'styled-components';
import FancyButton from './FancyButton';

const FormattedBox = styled(Box)`
    ${props => props.bold && css`font-weight: bold;`}
`;

export default function AnalysisView({analysis: {result, min, max, encoding}}) {
    const [showEncoding, setShowEncoding] = useState(false);

    return <React.Fragment>
        <Box margin={{top: "small"}}>
            {result.map(({category, value}, index) => <FormattedBox bold={index === 0} key={category} direction="row" margin={{horizontal: "small", bottom: index === 1 && "small"}} align="center">
                <Meter
                    round
                    values={[{
                        value: value - min,
                        color: `graph-${Math.max(4 - Math.ceil((value - min) / (max - min) * 4), 0)}`
                    }]}
                    max={max - min}
                    size="small"
                    thickness="xsmall"
                    background="light-5" />
                <Text margin={{horizontal: "small"}}>{category}</Text>
                <Text>{value}</Text>
            </FormattedBox>)}
        </Box>
        <FancyButton margin={{horizontal: "small", top: "small"}} onClick={() => setShowEncoding(true)}>View Encoding</FancyButton>
        {showEncoding && <Layer onEsc={() => setShowEncoding(false)} onClickOutside={() => setShowEncoding(false)}>
            <Box>
                <FancyButton margin="small" basis="medium" primary onClick={() => setShowEncoding(false)}>Done</FancyButton>
                <Box border="top" height="85vh" overflow="auto" pad="small" flex="grow" background="light-1">
                    <Grid columns={["flex", "flex", "flex"]}>
                        {encoding.map((value, index) => <Text key={index}>{value}</Text>)}
                    </Grid>
                </Box>
            </Box>
        </Layer>}
    </React.Fragment>
}