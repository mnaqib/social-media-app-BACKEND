import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../util/hooks'

function PostForm() {
  const { values, onSubmit, onChange } = useForm(createPostCB, {
    body: '',
  })

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update() {
      values.body = ''
    },

    refetchQueries: [FETCH_POSTS_QUERY, 'getPosts'],
  })

  function createPostCB() {
    createPost()
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post</h2>
        <Form.Field>
          <Form.Input
            type="text"
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />

          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  )
}

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likesCount
      comments {
        id
        body
        username
        createdAt
      }
      CommentsCount
    }
  }
`

const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      body
      createdAt
      username
      comments {
        body
        id
        username
        createdAt
      }
      likes {
        username
      }
      likesCount
      CommentsCount
    }
  }
`

export default PostForm
