import { GraphQLClient, gql } from "graphql-request"
import { getSpecificBookOverview } from '../../services'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

//forcing dynamic page behavior to get new data from database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function reviews(req,res) {
  try {
    const inputData = JSON.parse(req.body)
    var slug = inputData.slug;

    const Book = await getSpecificBookOverview(slug)
    var newReviews = Book.Book.reviews || {reviews:[]}
    newReviews.reviews.push(inputData.review)

    const graphQLClient = new GraphQLClient((graphqlAPI), {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
      },
    });

    const query1 = gql`
      mutation UpdateReviews($newReviews: Json!, $slug: String!) {
        updateBook(
          where: { slug: $slug }
          data: { reviews: $newReviews }
        ) { 
          id 
        }
      }
    `;

    const result1 = await graphQLClient.request(query1, {
      newReviews: newReviews,
      slug: slug
    });

    const query2 = gql`
      mutation UpdateReviews($id: ID!) {
        publishBook(
          where: { id: $id }, to: PUBLISHED
        ) { 
          reviews 
        }
      }
    `;

    const result2 = await graphQLClient.request(query2, {
      id: result1.updateBook.id
    });

    return res.status(200).send(result2.publishBook)
  } catch (error) {
    // console.log(error)
    return res.status(400)
  }
}
