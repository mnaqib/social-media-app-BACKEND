import { gql, useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react'

function DeleteButton({ postId, redirect, commentId }) {
  const [confirm, setConfirm] = useState(false)

  const mutation = commentId ? DELETE_COMMENT : DELETE_POST

  const [deletePostORComment] = useMutation(mutation, {
    variables: {
      postId,
      commentId,
    },
    refetchQueries: [FETCH_POSTS_QUERY, 'getPosts'],
  })
  const navigate = useNavigate()
  return (
    <>
      <Popup
        content={commentId ? 'Delete Comment' : 'Delete Post'}
        inverted
        trigger={
          <Button
            as="div"
            color="blue"
            onClick={() => setConfirm(true)}
            floated="right"
          >
            <Icon style={{ margin: 0 }} name="trash alternate"></Icon>
          </Button>
        }
      />

      <Confirm
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          deletePostORComment()
          if (redirect) navigate('/')
        }}
      />
    </>
  )
}

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      CommentsCount
    }
  }
`

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
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

export default DeleteButton
