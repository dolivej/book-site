import React from 'react'
import Head from 'next/head'
import moment from 'moment';
import { Navbar, BookShowcase } from '../../components'
import { getChapter, getAllChapterSlugs } from '../../services'
import NextNProgress from 'nextjs-progressbar';
import Link from 'next/link'

const navigation = [
  { name: 'All Books', href: '/', current: false },
  { name: 'Support', href: '/', current: false },
]

const ChapterPage = ({ Chapter }) => {
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

  if(Chapter == undefined){
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
        <title>{"David's Books - " + Chapter.book.title + " - " + Chapter.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextNProgress color="#FCA311" height={6} stopDelayMs={200}/>
      <Navbar title="David's Books" target={'/'} navigation={navigation}/>
      <div className="max-w-7xl pt-8 mx-auto px-8">
        <div className="max-w-3xl">
          <div className="flex select-none mt-1 text-xs text-gray-300 underline cursor-pointer">
            {Chapter.previousChapter && <Link href={"/chapters/" + Chapter.previousChapter.slug} className="text-large mt-3 mr-4 py-1 hover:text-black ease-in-out duration-100">Previous Chapter</Link>}
            {Chapter.nextChapter && <Link href={"/chapters/" + Chapter.nextChapter.slug} className="text-large mt-3 mr-auto py-1 hover:text-black ease-in-out duration-100">Next Chapter</Link>}
          </div>
          <h1 className='font-bold text-5xl mt-2'>{Chapter.title}</h1>
          <div className="flex select-none mt-1 text-lg font-semibold">
            <div style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-large mt-3 text-white mr-4 px-2 py-1 rounded">{Chapter.authors[0].name}</div>
            <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded">{moment(Chapter.date).format('DD, MMM, YYYY')}</div>
          </div>
          {Chapter.quote && <div style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="text-xl mt-14 w-full drop-shadow-lg pt-8 px-5 pb-1">
              {Chapter.quote.raw.children.map((typeObj, index) => {
                  const children = typeObj.children.map((item, itemIndex) => {
                  return getContentFragment(itemIndex, item.text, item)
                })

                return getContentFragment(index, children, typeObj, typeObj.type)
              })}
          </div>}
          <div className="text-lg mt-14">
              {Chapter.content.raw.children.map((typeObj, index) => {
                  const children = typeObj.children.map((item, itemIndex) => {
                  return getContentFragment(itemIndex, item.text, item)
                })

                return getContentFragment(index, children, typeObj, typeObj.type)
              })}
          </div>
          <div className="flex select-none mt-14 text-lg font-semibold mb-14">
           {Chapter.previousChapter && <Link href={"/chapters/" + Chapter.previousChapter.slug} style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-large mt-3 text-white mr-4 px-2 py-1 rounded cursor-pointer ease-in-out duration-100 hover:scale-105">Previous Chapter</Link>}
           {Chapter.nextChapter && <Link href={"/chapters/" + Chapter.nextChapter.slug} style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded cursor-pointer ease-in-out duration-100 hover:scale-105">Next Chapter</Link>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterPage


export async function getStaticProps({ params }) {
  const Chapter = await getChapter(params.slug)

  return {
    props: { Chapter }
  }
}

export async function getStaticPaths() {
  const Chapters = await getAllChapterSlugs();

  return {
    paths: Chapters.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: true,
  };
}