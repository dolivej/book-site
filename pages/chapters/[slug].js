import Head from 'next/head'
import moment from 'moment';
import { Navbar, BookShowcase } from '../../components'
import { getChapter, getAllChapterSlugs } from '../../services'
import NextNProgress from 'nextjs-progressbar';

const navigation = [
  { name: 'All Books', href: '/', current: false },
  { name: 'Support', href: '/', current: false },
]

const ChapterPage = ({ Chapter }) => {
  // console.log(Chapter)

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
      <div className="flex max-w-7xl pt-8 mx-auto px-8">
        <div>
          {Chapter.title}
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