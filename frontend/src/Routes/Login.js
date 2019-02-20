import React from 'react'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'   
import { Button, Container, Header, Input, Message } from 'semantic-ui-react'


export default observer(class Login extends React.Component {
    constructor(props) {
        super(props)

        extendObservable(this, {
            email: '',
            password: '',
        })  
    }
    onChange = (e) => {
        const {name, value } = e.target
        this[name] = value
    }
    onSubmit = () => {
        const { email, password } = this
        console.log(email)
    }
    render() {
        const { email, password } = this
        return (
            <Container text>
                <Header as='h2'>Login</Header>
                <Input name="email" onChange={this.onChange} value={email} fluid  placeholder='Email' />
                <Input name="password" onChange={this.onChange} value={password} type="password" fluid  placeholder='Password' />
                <Button onClick={this.onSubmit}>Login</Button>
            </Container>
        )
    }
})