import React from 'react'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'   
import { Form, Button, Container, Header, Input, Message } from 'semantic-ui-react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'

const LOGIN_MUTATION = gql`
    mutation($email: String!, $password:String!){
        login(email:$email, password:$password){
            ok
            token
            refreshToken
            errors {
                message
                path
            }
        }
    }
`


class Login extends React.Component {
    constructor(props) {
        super(props)

        extendObservable(this, {
            email: '',
            password: '',
            errors: {}
        })  
    }
    onChange = (e) => {
        const {name, value } = e.target
        this[name] = value
    }
    onSubmit = async () => {
        const { email, password } = this

        const response = await this.props.mutate({
            variables: { email, password }
        })
        console.log(response)
        const { ok, token, refreshToken, errors } = response.data.login
        if(ok) {
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
            this.props.history.push('/')
        } else {
            const err = {}
            errors.forEach(({path, message}) => {
                err[`${path}Error`] = message
            })
            this.errors = err
        }
    }

    render() {
        const { email, password, errors: {emailError, passwordError} } = this

        let errorList = [];

        if(emailError) {
            errorList = [...errorList, emailError]
        }
        if(passwordError) {
            errorList = [...errorList, passwordError]
        }
        return (
            <Container text>
                <Header as='h2'>Login</Header>
                <Form>
                    <Form.Field error={!!emailError}>
                    <Input name="email" onChange={this.onChange} value={email} fluid  placeholder='Email' />
                    </Form.Field>
                    <Form.Field error={!!passwordError}>

                    <Input name="password" onChange={this.onChange} value={password} type="password" fluid  placeholder='Password' />
                    </Form.Field>
                    <Button onClick={this.onSubmit}>Login</Button>
                </Form>

                {
                    (emailError || passwordError) &&
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

export default graphql(LOGIN_MUTATION)(observer(Login)) 