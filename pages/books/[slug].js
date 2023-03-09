import React from 'react'
import Head from 'next/head'
import { Navbar, BookShowcase } from '../../components'
import { getSpecificBookOverview, getAllBooksOverview } from '../../services'
import Link from 'next/link'
import NextNProgress from 'nextjs-progressbar';
import moment from 'moment';

const navigation = [
    { name: 'All Books', href: '/', current: false },
    { name: 'Support', href: '/', current: false },
]

const BookDetails = ({ Book }) => {

  const getContentFragment = (index, text, obj, type) => {
    let modifiedText = text;

    if (obj) {
      if (obj.bold) {
        modifiedText = (<b key={index}>{text}</b>);
      }

      if (obj.italic) {
        modifiedText = (<em key={index}>{text}</em>);
      }

      if (obj.underline) {
        modifiedText = (<u key={index}>{text}</u>);
      }
    }

    switch (type) {
      case 'heading-three':
        return <h3 key={index} className="text-xl font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
      case 'paragraph':
        return <p key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>;
      case 'heading-four':
        return <h4 key={index} className="text-md font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
      case 'image':
        return (
          <img
            key={index}
            alt={obj.title}
            height={obj.height}
            width={obj.width}
            src={obj.src}
          />
        );
      default:
        return modifiedText;
    }
  }; 

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
          <NextNProgress color="#FCA311" height={6} stopDelayMs={200}/>
          <Navbar title={"David's Books"} target={'/'} navigation={navigation}/>
          <div className="md:flex lg:flex mx-auto max-w-7xl pt-8 px-12 sm:px-8 md:px-8 lg:px-8">
            <div className='sm:w-5/5 md:w-2/5 lg:w-1/5 items-center justify-center pb-8'>
              <img src={Book.cover.url} className='drop-shadow-md'/>
            </div>
            <div className='sm:w-5/5 md:w-3/5 lg:w-3/5 items-center justify-center sm:px-0 md:pl-12'>
              <h1 className='font-bold text-5xl'>{Book.title}</h1>
              <div className="flex select-none mt-1 font-semibold text-lg">
                    <div style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-large mt-3 text-white mr-2 px-2 py-1 rounded">{Book.wordCount+"K words"}</div>
                    {Book.completed && <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded">{"Completed - " + moment(Book.completedDate).format('MMM, YYYY')}</div>}
                    {!Book.completed && <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded">{"In Progress"}</div>}
              </div>
              <div className="text-lg text-black overflow-y-hidden mt-14">
                    {Book.description.raw.children.map((typeObj, index) => {
                            const children = typeObj.children.map((item, itemIndex) => {
                            return getContentFragment(itemIndex, item.text, item)
                        })

                        return getContentFragment(index, children, typeObj, typeObj.type)
                    })}
              </div>
              <h1 className='font-bold text-3xl mt-14'>Table of Contents</h1>
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-1 font-semibold mb-20">
                {Book.chapters.map((chapter) => <Link href={'/chapters/'+chapter.slug} style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-2 px-2 py-2 rounded cursor-pointer text-center hover:drop-shadow-md hover:scale-105 ease-in-out duration-100">{chapter.title.split(':')[0]}</Link>)}

              </div>
            </div>
          </div>
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