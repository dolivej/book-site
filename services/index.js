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
      }          
  `

  const result = await request(graphqlAPI, query);

  return result.booksConnection.edges;
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
    } 
  `

  const result = await request(graphqlAPI, query, { slug });

  return result.book;
}