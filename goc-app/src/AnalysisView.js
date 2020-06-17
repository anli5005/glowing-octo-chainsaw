import React from 'react';
import { Box, Text, Meter } from 'grommet';
import styled, { css } from 'styled-components';

const FormattedBox = styled(Box)`
    ${props => props.bold && css`font-weight: bold;`}
`;

export default function AnalysisView({analysis: {result, min, max}}) {
    return <React.Fragment>
        <Box margin={{top: "small"}}>
            {result.map(({category, value}, index) => <FormattedBox bold={index === 0} key={category} direction="row" margin={{horizontal: "small", bottom: index === 0 && "small"}} align="center">
                <Meter round values={[{value: value - min}]} max={max - min} size="small" thickness="xsmall" />
                <Text margin={{horizontal: "small"}}>{category}</Text>
                <Text>{value}</Text>
            </FormattedBox>)}
        </Box>
    </React.Fragment>
}