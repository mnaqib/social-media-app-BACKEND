import { gql, useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Label, Button, Popup } from 'semantic-ui-react'

function LikeButton({ user, post: { likes, id, likesCount } }) {
  const [liked, setLiked] = useState(false)
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true)
    } else setLiked(false)
  }, [user, likes])

  const [likePost] = useMutation(LIKE_POST, {
    variables: {
      postId: id,
    },
  })

  const likeButton = user ? (
    liked ? (
      <Button color="red">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="red" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="red" basic>
      <Icon name="heart" />
    </Button>
  )
  return (
    <Popup
      content={liked ? 'Unlike' : 'like'}
      inverted
      trigger={
        <Button as="div" labelPosition="right" onClick={likePost}>
          {likeButton}
          <Label basic color="red" pointing="left">
            {likesCount}
          </Label>
        </Button>
      }
    />
  )
}

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likesCount
    }
  }
`

export default LikeButton
