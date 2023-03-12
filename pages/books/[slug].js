import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import { Navbar, BookShowcase } from '../../components'
import { getSpecificBookOverview, getAllBooksOverview } from '../../services'
import Link from 'next/link'
import NextNProgress from 'nextjs-progressbar';
import moment from 'moment';
import { useRouter } from 'next/dist/client/router';
import supabase from '../../supabase/public'


const navigation = [
    { name: 'All Books', href: '/', current: false },
    { name: 'Support', href: '/', current: false },
]

const BookDetails = ({ Book }) => {

  const [views, setViews] = useState(69)

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

  const router = useRouter();

  useEffect(() => {
    const fetchViews = async () => {
      const { data, error } = await supabase
        .from('views_per_slug')
        .select('view_count')
        .eq('slug', window.location.pathname)

      if (error) {
        setViews(69)
      }else{
        if(data[0]){
          setViews(data[0].view_count)
        }else{
          setViews(69)
        }
      }
    }

    fetchViews()

  },[router.asPath]);

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
    return (
        <div>
          <Head>
            <title>{"David's Books - " + Book.title}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <NextNProgress color="#FCA311" height={6} stopDelayMs={200}/>
          <Navbar title={"David's Books"} target={'/'} navigation={navigation}/>
          <div className="md:flex lg:flex mx-auto max-w-7xl pt-8 px-8 sm:px-8 md:px-8 lg:px-8">
            <div className='sm:w-5/5 md:w-2/5 lg:w-1/5 items-center justify-center pb-8'>
              <img src={Book.cover.url} className='drop-shadow-md'/>
            </div>
            <div className='sm:w-5/5 md:w-3/5 lg:w-3/5 items-center justify-center sm:px-0 md:pl-12'>
              <h1 className='font-bold text-5xl'>{Book.title}</h1>
              <div className="flex select-none mt-1 font-semibold text-lg">
                    <div style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-large mt-3 text-white mr-2 px-2 py-1 rounded">{Book.wordCount+"K words"}</div>
                    {Book.completed && <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-2 px-2 py-1 rounded">{"Completed - " + moment(Book.completedDate).format('MMM, YYYY')}</div>}
                    {!Book.completed && <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-2 px-2 py-1 rounded">{"In Progress"}</div>}
                    <div style={{backgroundColor:"#FCA311"}} className="hidden sm:flex md:flex lg:flex text-large mt-3 text-white mr-auto px-2 py-1 rounded">
                      <svg style={{width:"25px"}} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                      </svg>
                      <p className="ml-2 flex">{views + " Reads"}</p>
                    </div>
              </div>
              <div className="flex sm:hidden md:hidden lg:hidden select-none mt-1 text-lg font-semibold">
                <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded flex">
                  <svg style={{width:"25px"}} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                  </svg>
                  <p className="ml-2 flex">{views + " Reads"}</p>
                </div>
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