import React from 'react'
import styled from 'styled-components'
import {Header} from 'semantic-ui-react'

const Styles = styled.div`
    grid-column: 3;
    grid-row: 1;
`

export default ({channelName}) => (
    <Styles>
        <Header textAlign="center">#{channelName}</Header>
    </Styles>
)