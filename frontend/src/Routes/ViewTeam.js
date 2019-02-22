import React from 'react'

import AppLayout from '../components/AppLayout'
import Teams from '../components/Teams'
import Channels from '../components/Channels'
import Header from '../components/Header'
import Messages from '../components/Messages'
import Input from '../components/Input'


export default () => {
    return (
        <AppLayout>
            <Teams></Teams>
            <Channels></Channels>
            <Header></Header>
            <Messages></Messages>
            <Input></Input>
        </AppLayout>
    )
}