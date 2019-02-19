import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { Button, Container, Header, Input } from 'semantic-ui-react'

const REGISTER_USER_MUTATION = gql`
    mutation ($username: String!, $email: String!, $password:String!){
        registerUser(username: $username, email: $email, password: $password)
    }  
`


class Register extends React.Component {

    state = {
        username: '',
        email: '',
        password: '',
    }
    onChange = (event)=>{
        const { name, value} = event.target
        this.setState(() => ({
            [name]:value
        }))
    }

    onSubmit = async () => {
        console.log(this.state)
        const response = await this.props.mutate({
            variables: this.state
        })
        console.log(response)
    }

    render() {

        const { username, email, password } = this.state
        return(
            <Container text>
                <Header as='h2'>Register</Header>
                <Input name="username" onChange={this.onChange} value={username} fluid  placeholder='Username' />
                <Input name="email" onChange={this.onChange} value={email} fluid  placeholder='Email' />
                <Input name="password" onChange={this.onChange} value={password} type="password" fluid  placeholder='Password' />
                <Button onClick={this.onSubmit}>Register</Button>
            </Container>
        )
    }
}

export default graphql(REGISTER_USER_MUTATION)(Register)