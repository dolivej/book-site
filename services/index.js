import { graphql } from 'graphql'
import { request, gql } from 'graphql-request'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getAllBooksOverview = async () => {
    const query = gql`
    query Assets {
      booksConnection {
        edges {
          node {
            completed
            completedDate
            slug
            title
            wordCount
            cover {
              url
            }
            createdAt
            description {
              raw
            }
          }
        }
      }
      announcementsConnection {
        edges {
          node {
            content {
              raw
            }
          }
        }
      }
      updateSchedulesConnection {
        edges {
          node {
            content {
              raw
            }
          }
        }
      }
    }          
  `

  const result = await request(graphqlAPI, query);

  return {Books: result.booksConnection.edges, UpdateSchedule: result.updateSchedulesConnection.edges, Announcements: result.announcementsConnection.edges};
}


export const getSpecificBookOverview = async (slug) => {
    const query = gql`
    query Assets($slug: String!) {
        book(where: {slug: $slug}){
            completed
            completedDate
            slug
            title
            wordCount
            cover {
                url
            }
            createdAt
            description {
                raw
            }
            chapters {
                slug
                title
            }
            authors {
                name
            }
        }
        announcementsConnection {
          edges {
            node {
              content {
                raw
              }
            }
          }
        }
        updateSchedulesConnection {
          edges {
            node {
              content {
                raw
              }
            }
          }
        }
    } 
  `

  const result = await request(graphqlAPI, query, { slug });
  
  return {Book: result.book, UpdateSchedule: result.updateSchedulesConnection.edges, Announcements: result.announcementsConnection.edges};
}


export const getChapter = async (slug) => {
  const query = gql`
  query Assets($slug: String!) {
      chapter(where: {slug: $slug}){
        book {
          title
          slug
        }
        title
        slug
        comments
        visits
        reactions
        date
        content {
          raw
        }
        quote {
          raw
        }
        authors {
          ... on Author {
            name
          }
        }
        nextChapter {
          slug
        }
        previousChapter {
          slug
        }
      }
      announcementsConnection {
        edges {
          node {
            content {
              raw
            }
          }
        }
      }
      updateSchedulesConnection {
        edges {
          node {
            content {
              raw
            }
          }
        }
      }
  } 
  `

  const result = await request(graphqlAPI, query, { slug });

  return {Chapter: result.chapter, UpdateSchedule: result.updateSchedulesConnection.edges, Announcements: result.announcementsConnection.edges};
}


export const getAllChapterSlugs = async (slug) => {
  const query = gql`
  query Assets {
    chaptersConnection {
      edges {
        node {
          slug
        }
      }
    }
  }
  `

  const result = await request(graphqlAPI, query, { slug });

  return result.chaptersConnection.edges;
}


export const getSupportInfo = async () => {
  const query = gql`
  query Assets {
    announcementsConnection {
      edges {
        node {
          content {
            raw
          }
        }
      }
    }
    updateSchedulesConnection {
      edges {
        node {
          content {
            raw
          }
        }
      }
    }
    supportsConnection {
      edges {
        node {
          aboutContent {
            raw
          }
          contactContent {
            raw
          }
          supportContent {
            raw
          }
        }
      }
    }
  }          
`

const result = await request(graphqlAPI, query);

return {SupportInfo: result.supportsConnection.edges, UpdateSchedule: result.updateSchedulesConnection.edges, Announcements: result.announcementsConnection.edges};
}