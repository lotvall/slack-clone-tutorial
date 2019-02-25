import React from 'react'
import { Form, Input, Button, Modal } from 'semantic-ui-react'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo';
import { TEAMS_QUERY } from '../graphql/team'
import findIndex from 'lodash/findIndex'



const CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $name: String!) {
        createChannel(teamId: $teamId, name: $name) {
            ok
            channel {
                id
                name
            }
        }
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
            await mutate({ 
                variables: { 
                    teamId: parseInt(teamId, 10), 
                    name: values.name
                }, optimisticResponse: {
                    __typename: "Mutation",
                    createChannel: {
                        ok: true,
                        channel: {
                            __typename: "Channel",
                            id: -1,
                            name: values.name
                        },
                        __typename: "ChannelResponse"
                        
                    }
                },
                update: (store, { data: { createChannel }}) => {
                    const { ok, channel } = createChannel

                    if (ok) {
                        const data = store.readQuery({ query: TEAMS_QUERY })
                        const teamIdx = findIndex(data.allTeams, ['id', teamId ])
                        data.allTeams[teamIdx].channels.push(channel)
                        store.writeQuery({query: TEAMS_QUERY, data})
                    } else {
                        return
                    }
                    
                }
            })
            setSubmitting(false)
            onClose()
        },
    })
)(AddChannelModal)
