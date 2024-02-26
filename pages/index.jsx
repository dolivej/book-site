'use server'

import Head from 'next/head'
import React, {useState, useEffect} from 'react';
import { Navbar, BookShowcase } from '../components'
import { getAllBooksOverview } from '../services'
import NextNProgress from 'nextjs-progressbar';
import { useRouter } from 'next/dist/client/router';

const navigation = [
  { name: 'All Books', href: '/', current: true },
  { name: 'Support', href: '/support/support', current: false },
]

const Home = ({ BooksStatic, UpdateScheduleStatic, AnnouncementsStatic }) => {
  const [isFirstRender,setIsFirstRender] = useState(true)
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)

  const [Books, setBooks] = useState(BooksStatic || [])
  const [UpdateSchedule, setUpdateSchedule] = useState(UpdateScheduleStatic || [])
  const [Announcements, setAnnouncements] = useState(AnnouncementsStatic || [])

  //enabling dynamic load of new data on render
  useEffect(() => {
    // declare the data fetching function
    console.log("REFRESHING DATA")
    const fetchData = async () => {
      const Data = (await getAllBooksOverview()) || {};
      setBooks(Data.Books || [])
      setUpdateSchedule(Data.UpdateSchedule || [])
      setAnnouncements(Data.Announcements || [])
    }
  
    // call the function
    fetchData()
  }, [])

  
  
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
        <title>Grimdark Books</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextNProgress color="#FCA311" height={6} stopDelayMs={200}/>
      <Navbar title="Grimdark Books" target={'/'} navigation={navigation}/>
      <div className="mx-auto max-w-7xl pt-8 px-8 lg:w-full md:w-64 lg:ml-auto md:ml-auto lg:mr-2 md:mr-2 block lg:hidden md:hidden">
          <div className="">
            {!isAnnouncementOpen && <div onClick={()=>{setIsAnnouncementOpen(!isAnnouncementOpen)}} style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="cursor-pointer flex mt-0 w-full drop-shadow-lg pt-2 px-4 pb-1 ease-in-out duration-100">
              <p className="font-bold text-lg">Update Schedule & Announcements</p>
              <svg className="w-5 ml-auto" fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
            </div>}
            {isAnnouncementOpen && <div style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="mt-0 w-full drop-shadow-lg pt-2 px-4 pb-1 ease-in-out duration-100">
              <div onClick={()=>{setIsAnnouncementOpen(!isAnnouncementOpen)}} className='flex cursor-pointer'>
                <p className="font-bold text-lg">Update Schedule & Announcements</p>
                <svg className="w-5 ml-auto" fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>
              </div>

              <div style={{backgroundColor:"white", borderTop: "thin solid #FCA311", borderBottom: "thin solid #FCA311"}} className="mt-10 mb-5 py-2">
                <p className="font-bold text-lg underline">Update Schedule:</p>
                {UpdateSchedule.map((Schedule) => <div className="mt-5 ml-5">
                  {Schedule.node.content.raw.children.map((typeObj, index) => {
                      const children = typeObj.children.map((item, itemIndex) => {
                      return getContentFragment(itemIndex, item.text, item)
                    })

                    return getContentFragment(index, children, typeObj, typeObj.type)
                  })}
                </div>)}
              </div>
              <div style={{backgroundColor:"white", borderTop: "thin solid #FCA311", borderBottom: "thin solid #FCA311"}} className="mt-10 mb-5 py-2">
                <p className="font-bold text-lg underline">Announcements:</p>
                {Announcements.reverse().map((Announcement, pos) => <div style={{backgroundColor:"white", borderTop: pos !== 0 ? "thin solid #FCA311" : ""}} className="mt-5 pt-5 ml-5">
                  {Announcement.node.content.raw.children.map((typeObj, index) => {
                      const children = typeObj.children.map((item, itemIndex) => {
                      return getContentFragment(itemIndex, item.text, item)
                    })

                    return getContentFragment(index, children, typeObj, typeObj.type)
                  })}
                </div>)}
              </div>
            </div>}
          </div>
      </div>
      <div className="flex mx-auto max-w-7xl pt-8">
        <div className="flex-initial lg:w-5/5 md:w-3/4 sm:w-full px-8 sm:px-8 md:pr-0 md:pl-8 lg:pr-0 lg:pl-8 grid gap-20 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 lg:px-8 mb-20">
          {Books.map((book) => <BookShowcase book={book.node} key={book.node.title} />)}
        </div>
        <div className="lg:w-64 md:w-64 lg:ml-auto md:ml-auto lg:mr-2 md:mr-2 hidden lg:block md:block mb-20">
          <div className="w-4/5 ml-7">
          {true && <div style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="mt-0 w-full drop-shadow-lg pt-2 px-4 pb-1">
            <p className="font-bold text-lg">Update Schedule:</p>
            {UpdateSchedule.map((Schedule) => <div className="mt-5">
              {Schedule.node.content.raw.children.map((typeObj, index) => {
                  const children = typeObj.children.map((item, itemIndex) => {
                  return getContentFragment(itemIndex, item.text, item)
                })

                return getContentFragment(index, children, typeObj, typeObj.type)
              })}
            </div>)}
          </div>}
          {true && <div style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="mt-4 w-full drop-shadow-lg pt-2 px-4 pb-1">
            <p className="font-bold text-lg">Announcements:</p>
            {Announcements.reverse().map((Announcement) => <div style={{backgroundColor:"white", borderTop: "thin solid #FCA311"}} className="mt-5 pt-5">
              {Announcement.node.content.raw.children.map((typeObj, index) => {
                  const children = typeObj.children.map((item, itemIndex) => {
                  return getContentFragment(itemIndex, item.text, item)
                })

                return getContentFragment(index, children, typeObj, typeObj.type)
              })}
            </div>)}
          </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

//forcing dynamic page behavior to get new data from database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function getStaticProps() {
  const Data = (await getAllBooksOverview()) || {};

  return {
    props: { BooksStatic : Data.Books || [], UpdateScheduleStatic : Data.UpdateSchedule || [], AnnouncementsStatic : Data.Announcements || []}
  }
}
