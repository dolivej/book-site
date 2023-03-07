import React from 'react'
import Head from 'next/head'
import { Navbar, BookShowcase } from '../../components'
import { getSpecificBookOverview, getAllBooksOverview } from '../../services'

const navigation = [
    { name: 'All Books', href: '/', current: false },
    { name: 'Support', href: '/', current: false },
]

const BookDetails = ({ Book }) => {
    if(Book == undefined){
        return (
            <div>
              <Head>
                <title>{"David's Books - Woops!"}</title>
                <link rel="icon" href="/favicon.ico" />
              </Head>
              <Navbar title={"Woops!"} target={"/"} navigation={navigation}/>
            </div>
          ) 
    }
    
    return (
        <div>
          <Head>
            <title>{"David's Books - " + Book.title}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar title={Book.title} target={Book.slug} navigation={navigation}/>
        </div>
      )
}

export default BookDetails

export async function getStaticProps({ params }) {
    const Book = await getSpecificBookOverview(params.slug)

    return {
      props: { Book }
    }
}

export async function getStaticPaths() {
    const Books = await getAllBooksOverview();

    return {
      paths: Books.map(({ node: { slug } }) => ({ params: { slug } })),
      fallback: true,
    };
  }