import React from 'react'
import styled from 'styled-components'
import {Header} from 'semantic-ui-react'

const Root = styled.div`
    grid-column: 3;
    grid-row: 1;
`

export default ({channelName}) => (
    <Root>
        <Header textAlign="center">#{channelName}</Header>
    </Root>
)