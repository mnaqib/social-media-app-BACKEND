import { gql, useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import React, { useContext, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Popup,
} from 'semantic-ui-react'
import DeleteButton from '../components/DeleteButton'
import LikeButton from '../components/LikeButton'
import { AuthContext } from '../context/auth'

function SinglePost() {
  const { id: postId } = useParams()
  const { user } = useContext(AuthContext)
  const [comment, setComment] = useState('')
  const commentInputRef = useRef(null)

  const { data } = useQuery(FETCH_POST, {
    variables: {
      postId,
    },
  })

  const [submitComment] = useMutation(CREATE_COMMENT, {
    update() {
      setComment('')
      commentInputRef.current.blur()
    },
    variables: {
      postId,
      body: comment,
    },
  })

  let postMarkup
  if (!data) {
    postMarkup = <p>Loading post...</p>
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likesCount,
      CommentsCount,
    } = data.getPost

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likesCount, likes }} />
                <Popup
                  content="Comment on Post"
                  inverted
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => commentInputRef.current.focus()}
                    >
                      <Button basic color="teal">
                        <Icon name="comment" />
                      </Button>
                      <Label basic color="teal" pointing="left">
                        {CommentsCount}
                      </Label>
                    </Button>
                  }
                />

                {user && user.username === username && (
                  <DeleteButton postId={id} redirect={true} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
  return postMarkup
}

const FETCH_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likesCount
      likes {
        username
      }
      CommentsCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`
const CREATE_COMMENT = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      CommentsCount
    }
  }
`
export default SinglePost
