import React from 'react'
import { Form, Input, Button, Modal } from 'semantic-ui-react'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo';

const CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $name: String!) {
        createChannel(teamId: $teamId, name: $name)
    }
`

const AddChannelModal = ({
    open, 
    onClose, 
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Add channel</Modal.Header>
    <Modal.Content>
        <Form>
            <Form.Field>
                <Input value={values.name} onChange={handleChange} onBlur={handleBlur} name="name" fluid placeholder="Channel name"/>
            </Form.Field>
            <Form.Group width="equal">
                <Button disabled={isSubmitting} fluid onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} fluid>Add Chanel</Button>
            </Form.Group>
        </Form>

    </Modal.Content>
  </Modal>
)

export default compose(
    graphql(CREATE_CHANNEL_MUTATION), 
    withFormik({
        mapPropsToValues: () => ({ name: '' }),
    
        handleSubmit: async (values, { props: { teamId, mutate,  onClose }, setSubmitting }) => {
            await mutate({ variables: { teamId: parseInt(teamId, 10), name: values.name}})
            setSubmitting(false)
            onClose()
        },
    })
)(AddChannelModal)
