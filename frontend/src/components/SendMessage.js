import React from 'react'
import styled from 'styled-components'
import {Input} from 'semantic-ui-react'
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Root = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px
`
const ENTER_KEY = 13

const SendMessage = ({ 
    placeholder,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
}) => (
    <Root>
        <Input
            onKeyDown={(e) => {
                console.log(e.keyCode)
                if(e.keyCode === ENTER_KEY && !isSubmitting) {
                    handleSubmit(e)
                }
            }} 
            onBlur={handleBlur}
            onChange={handleChange}
            name="message"
            value={values.message}
            fluid
            placeholder={`# ${placeholder}`}
        />
    </Root>
)

export default withFormik({

        mapPropsToValues: () => ({ message: '' }),
        
        handleSubmit: async (values, { props: { onSubmit  }, resetForm, setSubmitting }) => {
            if(!values.message || !values.message.trim()) {
                setSubmitting(false)
                return
            }

            try {
                await onSubmit(values.message)
                // await mutate({ 
                // variables: { 
                //     channelId, 
                //     text: values.message
                // }
                // })
            } catch(err) {
                console.log(err)
            }
            resetForm()
        }
    })
(SendMessage)