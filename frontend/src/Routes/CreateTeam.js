import React from 'react'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'   
import { Form, Button, Container, Header, Input, Message } from 'semantic-ui-react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'

const CREATE_TEAM_MUTATION = gql`
    mutation($name: String!) {
        createTeam(name: $name) {
        ok
        errors {
            message
            path
        }
        }
    }
`


class CreateTeam extends React.Component {
    constructor(props) {
        super(props)

        extendObservable(this, {
            name:'',
            errors: {}
        })  
    }
    onChange = (e) => {
        const {name, value } = e.target
        this[name] = value
    }
    onSubmit = async () => {
        const { name } = this

        const response = await this.props.mutate({
            variables: { name }
        })
        console.log(response)
        const { ok, errors } = response.data.createTeam
        if(ok) {
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
        const { name, errors: {nameError} } = this

        let errorList = [];

        if(nameError) {
            errorList = [...errorList, nameError]
        }
        
        return (
            <Container text>
                <Header as='h2'>Create a team</Header>
                <Form>
                    <Form.Field error={!!nameError}>
                    <Input name="name" onChange={this.onChange} value={name} fluid  placeholder='Name' />
                    </Form.Field>
                    
                    <Button onClick={this.onSubmit}>Submit</Button>
                </Form>

                {
                    (nameError) &&
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

export default graphql(CREATE_TEAM_MUTATION)(observer(CreateTeam)) 