import React from 'react'
import { Message, Form, Input, Button, Modal } from 'semantic-ui-react'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo';
import normalizeErrors from '../normalizeErrors'

import { USER_QUERY } from '../graphql/user'
import findIndex from 'lodash/findIndex'


const ADD_TEAM_MEMBER_MUTATION = gql`
    mutation ($email:String!, $teamId:Int!){
        addTeamMember(email: $email, teamId:$teamId){
        ok
        errors {
            path
            message
        }
        }
    }
`

const InvitePeopleModal = ({
    open, 
    onClose, 
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    touched,
    errors,
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Add people to your team</Modal.Header>
    <Modal.Content>
        <Form>
            <Form.Field>
                <Input value={values.email} onChange={handleChange} onBlur={handleBlur} name="email" fluid placeholder="Users email"/>
            </Form.Field>
             
                 
            <Form.Group width="equal">
                <Button disabled={isSubmitting} fluid onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} fluid>Add User</Button>
            </Form.Group>
        </Form>
        {
            touched.email && errors.email &&
            <Message
                error
            >
                { errors.email[0] }
            </Message>
        }

    </Modal.Content>
  </Modal>
)

export default compose(
    graphql(ADD_TEAM_MEMBER_MUTATION), 
    withFormik({
        mapPropsToValues: () => ({ email: '' }),
    
        handleSubmit: async (values, { props: { teamId, mutate,  onClose }, setSubmitting, setErrors  }) => {
            const response = await mutate({ 
                variables: { 
                    teamId: parseInt(teamId, 10), 
                    email: values.email
                }

            })
            console.log(response)

            const { ok, errors } = response.data.addTeamMember

            if(ok) {
                // add SuccessMessage
                setSubmitting(false)
                onClose()
            } else {
                setSubmitting(false)
                const filteredErrors = errors.filter(e => e.message !== "user_id must be unique")
                if (errors.length !== filteredErrors.length) {
                    filteredErrors.push({
                        path: "email",
                        message: "This user is already a part of the team"                        
                    })
                }
                setErrors(normalizeErrors(filteredErrors))
            }
            
        },
    })
)(InvitePeopleModal)
 