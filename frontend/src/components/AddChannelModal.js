import React from 'react'
import { Checkbox, Form, Input, Button, Modal } from 'semantic-ui-react'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo';
import { USER_QUERY } from '../graphql/user'
import findIndex from 'lodash/findIndex'
import SelectMultiUsers from './SelectMultiUsers'



const CREATE_CHANNEL_MUTATION = gql`
    mutation($teamId: Int!, $name: String!, $public: Boolean!, $members: [Int!]) {
        createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
            ok
            channel {
                id
                name
            }
        }
    }
`

const AddChannelModal = ({
    teamId,
    open, 
    onClose, 
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm,
    setFieldValue
}) => (
    <Modal open={open} onClose={() => {
        resetForm()
        onClose()
    }}>
    <Modal.Header>Add channel</Modal.Header>
    <Modal.Content>
        <Form>
            <Form.Field>
                <Input value={values.name} onChange={handleChange} onBlur={handleBlur} name="name" fluid placeholder="Channel name"/>
            </Form.Field>
            <Form.Field>
                <Checkbox 
                    value={!values.public} label='Private'
                    onChange={(e, { checked }) => setFieldValue('public', !checked)}
                    toggle 

                />
            </Form.Field>
            {
                !values.public && <Form.Field>
                <SelectMultiUsers
                    teamId={teamId}
                    selectedMembers={values.members}
                    handleChange={(e, { value }) => setFieldValue('members', value)}
                    placeholder="Select members to invite"
                />
            </Form.Field>}
            <Form.Group width="equal">
                <Button disabled={isSubmitting} fluid onClick={(e) => {
                    resetForm()
                    onClose(e)
                }}
                >Cancel</Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} fluid>Add Chanel</Button>
            </Form.Group>
        </Form>

    </Modal.Content>
  </Modal>
)

export default compose(
    graphql(CREATE_CHANNEL_MUTATION), 
    withFormik({
        mapPropsToValues: () => ({ name: '', members: [], public: true }),
    
        handleSubmit: async (values, { props: { teamId, mutate,  onClose }, setSubmitting }) => {
            await mutate({ 
                variables: { 
                    teamId: parseInt(teamId, 10),
                    public: values.public,
                    members: values.members, 
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
                    if(!ok) {
                        return
                    }
                        const data = store.readQuery({ query: USER_QUERY })
                        console.log('local storage data', data)
                        const teamIdx = findIndex(data.getUser.teams, ['id', teamId ])
                        data.getUser.teams[teamIdx].channels.push(channel)
                        store.writeQuery({query: USER_QUERY, data})
                    
                }
            })
            onClose()
            setSubmitting(false)
        },
    })
)(AddChannelModal)
