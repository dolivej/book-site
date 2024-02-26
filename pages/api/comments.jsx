import { GraphQLClient, gql } from "graphql-request"
import { getChapter } from '../../services'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

//forcing dynamic page behavior to get new data from database
export const dynamic = 'force-dynamic';

export default async function comments(req,res) {
  try {
    const inputData = JSON.parse(req.body)
    var slug = inputData.slug;

    const Chapter = await getChapter(slug)
    var newComments = Chapter.Chapter.comments || {comments:[]}
    
    if(inputData.location == "new"){
      newComments.comments.push(inputData.comment)
    }else{
      newComments.comments[inputData.location.split("-")[0]].replies.push(inputData.comment)
    }

    const graphQLClient = new GraphQLClient((graphqlAPI), {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
      },
    });

    const query1 = gql`
      mutation UpdateComments($newComments: Json!, $slug: String!) {
        updateChapter(
          where: { slug: $slug }
          data: { comments: $newComments }
        ) { 
          id 
        }
      }
    `;

    const result1 = await graphQLClient.request(query1, {
      newComments: newComments,
      slug: slug
    });

    const query2 = gql`
      mutation UpdateComments($id: ID!) {
        publishChapter(
          where: { id: $id }, to: PUBLISHED
        ) { 
          comments 
        }
      }
    `;

    const result2 = await graphQLClient.request(query2, {
      id: result1.updateChapter.id
    });

    return res.status(200).send(result2.publishChapter)
  } catch (error) {
    // console.log(error)
    return res.status(400)
  }
}
