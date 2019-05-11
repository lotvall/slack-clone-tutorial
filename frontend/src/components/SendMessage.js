import React from 'react'
import styled from 'styled-components'
import { Input, Button, Icon } from 'semantic-ui-react'
import { withFormik } from 'formik';
import FileUpload from './FileUpload'

const Root = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
    display: grid;
    grid-template-columns: 50px auto;
`
const ENTER_KEY = 13

const SendMessage = ({
    placeholder,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    channelId
}) => (
        <Root>
        <FileUpload channelId={channelId}>
        
            <Button icon>
                <Icon name='plus' />
            </Button>
        </FileUpload>
            <Input
                onKeyDown={(e) => {
                    console.log(e.keyCode)
                    if (e.keyCode === ENTER_KEY && !isSubmitting) {
                        handleSubmit(e)
                    }
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                name="message"
                value={values.message}
                placeholder={`# ${placeholder}`}
            />
        </Root>
    )

export default withFormik({

    mapPropsToValues: () => ({ message: '' }),

    handleSubmit: async (values, { props: { onSubmit }, resetForm, setSubmitting }) => {
        if (!values.message || !values.message.trim()) {
            setSubmitting(false)
            return
        }

        try {
            await onSubmit(values.message)
        } catch (err) {
            console.log(err)
        }
        resetForm()
    }
})
    (SendMessage)