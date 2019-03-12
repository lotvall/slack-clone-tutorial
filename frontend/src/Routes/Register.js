import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { Form, Button, Container, Header, Input, Message } from 'semantic-ui-react'

const REGISTER_USER_MUTATION = gql`
mutation ($username: String!, $email: String!, $password:String!){
    registerUser(username: $username, email: $email, password: $password){
      ok
      errors{
        path
        message
      }
    }
  }
`


class Register extends React.Component {

    state = {
        username: '',
        usernameError: '',
        email: '',
        emailError: '',
        password: '',
        passwordError: '',

    }
    onChange = (event)=>{
        const { name, value} = event.target
        this.setState(() => ({
            [name]:value
        }))
    }

    onSubmit = async () => {

        this.setState({
            usernameError:"",
            emailError: "",
            passwordError: "",
        })
        const {username, email, password } = this.state
        console.log(this.state)
        const response = await this.props.mutate({
            variables: { username, email, password }
        })
        console.log(response)
        const {ok, errors } = response.data.registerUser

        if(ok) {
            this.props.history.push('/login')
        } else {
            const err = {}
            errors.forEach(({path, message}) => {
                err[`${path}Error`] = message
            })
            this.setState(err)
        }
    }

    render() {

        const { username, email, password, usernameError, emailError, passwordError } = this.state

        let errorList = [];

        if(usernameError) {
            errorList = [...errorList, usernameError]
        }
        if(emailError) {
            errorList = [...errorList, emailError]
        }
        if(passwordError) {
            errorList = [...errorList, passwordError]
        }

        return(
            <Container text>
                <Header as='h2'>Register</Header>
                <Form>
                    <Form.Field error={!!usernameError}>
                        <Input  name="username" onChange={this.onChange} value={username} fluid  placeholder='Username' />
                    </Form.Field>

                    <Form.Field error={!!emailError}>
                        <Input  name="email" onChange={this.onChange} value={email} fluid  placeholder='Email' />
                    </Form.Field>

                    
                    <Form.Field error={!!passwordError}>
                        <Input name="password" onChange={this.onChange} value={password} type="password" fluid  placeholder='Password' />
                    </Form.Field>

                    <Button onClick={this.onSubmit}>Register</Button>
                </Form>
                {
                    (usernameError || emailError || passwordError) &&
                    <Message
                        error
                        header='There was some errors with your submission'
                        list={errorList}
                    />
                }
            </Container>
        )
    }
}

export default graphql(REGISTER_USER_MUTATION)(Register)