import gql from 'graphql-tag'

export default app => {
  const lang = app.$i18n.locale().toUpperCase()
  return gql`
    query Comment($postId: ID) {
      Comment(postId: $postId) {
        id
        contentExcerpt
        createdAt
        author {
          id
          slug
          name
          avatar {
            url
          }
          disabled
          deleted
          shoutedCount
          contributionsCount
          commentedCount
          followedByCount
          followedByCurrentUser
          location {
            name: name${lang}
          }
          badges {
            id
            icon
          }
        }
      }
    }
  `
}
