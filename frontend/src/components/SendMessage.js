import React from 'react'
import styled from 'styled-components'
import {Input} from 'semantic-ui-react'

const Root = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px
`

export default ({ channelName }) => (
    <Root>
        <Input 
            fluid
            placeholder={`# ${channelName}`}
        />
    </Root>
)