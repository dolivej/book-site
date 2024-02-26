import React, {useState, useEffect, useRef} from 'react'
import Head from 'next/head'
import { Navbar, BookShowcase } from '../../components'
import { getSpecificBookOverview, getAllBooksOverview } from '../../services'
import Link from 'next/link'
import NextNProgress from 'nextjs-progressbar';
import moment from 'moment';
import { useRouter } from 'next/dist/client/router';
import supabase from '../../supabase/public'
import { Rating } from 'react-simple-star-rating'
import Gravatar from 'react-gravatar'
import { headers } from 'next/headers'

const navigation = [
    { name: 'All Books', href: '/', current: false },
    { name: 'Support', href: '/support/support', current: false },
]

const BookDetails = ({ Book, UpdateSchedule, Announcements }) => {
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [views, setViews] = useState(69)
  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSucessMessage] = useState(false);
  const [showLoadingMessage, setLoadingMessage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveData, setSaveData] = useState(true);
  const nameEl = useRef();
  const emailEl = useRef();
  const storeDataEl = useRef();
  const [rating, setRating] = useState(0)
  const [localReviews, setLocalReviews] = useState({reviews:[]});
  const [numReviews, setNumReviews] = useState(1)
  const [totalReview, setTotalReview] = useState(4)

  //forcing dynamic behavior for this component
  const headersList = headers()
    
  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate)
  }

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

  const updateReviewCounts = (reviewArray) => {
    let total = 0;
    for (var i = 0; i < reviewArray.length; i++) {
      total = total + reviewArray[i].rating
    }

    setNumReviews(reviewArray.length)
    setTotalReview(total / reviewArray.length)
  }

  const router = useRouter();

  useEffect(() => {
    setShowSucessMessage(false)
    if(localStorage.getItem('bookSiteDataSave') == "true"){
      setEmail(localStorage.getItem('bookSiteEmail'))
      setName(localStorage.getItem('bookSiteName'))
    }else{
      setEmail("")
      setName("")
    }

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

    if(Book){
      setLocalReviews(Book.reviews || {reviews:[]})
      if(Book.reviews){
        updateReviewCounts(Book.reviews.reviews)
      }else{
        updateReviewCounts([{rating:4}])
      }
    }
  },[router.asPath]);

  const handleReviewSubmission = (commentId,replyName) => {
    if(!(typeof window === "undefined")){
      setError(false)

      const comment = document.getElementById("comment_box_" + commentId).value

      var commentDateObj = new Date();  //.toString()
      const commentDate = commentDateObj.toString()

      if(!rating || !name) {
        setError(true)
        return;
      }

      if(saveData == true){
        window.localStorage.setItem('bookSiteDataSave', true);
        window.localStorage.setItem('bookSiteEmail', email);
        window.localStorage.setItem('bookSiteName', name);
      }else{
        window.localStorage.setItem('bookSiteDataSave', false);
      }

      const reviewObj = { 
        name, 
        email, 
        content: comment, 
        date: commentDate,
        rating,
      }

      setLoadingMessage(true)

      submitReview(reviewObj, commentId, Book.slug)
        .then((res) => {
          console.log("success posted review")
          setLoadingMessage(false)
          setShowSucessMessage(true)

          setLocalReviews(res.reviews)
          updateReviewCounts(res.reviews.reviews)
          setTimeout(() => {
            setShowSucessMessage(false)

            var x_position = res.reviews.reviews.length-1

            if(commentId == "new"){
              document.getElementById("comment_" + x_position + "-base").scrollIntoView();
            }else{
              var locations = commentId.split("-")
              x_position = parseInt(locations[0])
              var y_position = res.reviews.reviews[x_position].replies.length-1

              document.getElementById("comment_" + x_position + "-" + y_position).scrollIntoView();
            }
          }, 1000);
        })
        .catch((e) => {
          console.log(e)
        })
      
    }
  }

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
            <title>{"Grimdark Books - " + Book.title}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <NextNProgress color="#FCA311" height={6} stopDelayMs={200}/>
          <Navbar title={"Grimdark Books"} target={'/'} navigation={navigation}/>
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
          <div className="md:flex lg:flex mx-auto max-w-7xl pt-8 px-8 sm:px-8 md:px-8 lg:px-8">
            <div className='sm:w-5/5 md:w-2/5 lg:w-1/5 items-center justify-center pb-8'>
              <img src={Book.cover.url} className='drop-shadow-md'/>
            </div>
            <div className='sm:w-5/5 md:w-3/5 lg:w-3/5 items-center justify-center sm:px-0 md:pl-12 mb-10'>
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
              <h1 className='font-bold text-3xl mt-14'>Ratings:</h1>
              <div className="flex select-none mt-1 font-semibold text-lg mb-10">
                    <div style={{border:"2px solid #FCA311"}} className="lg:ml-0 font-bold text-large mt-3 text-white mr-2 px-2 py-1 rounded"><Rating allowFraction={true} initialValue={totalReview} readonly={true} emptyStyle={{ display: "flex" }} fillStyle={{ display: "-webkit-inline-box" }} /></div>
                    <div style={{backgroundColor:"#FCA311"}} className="text-3xl font-bold mt-3 text-white mr-2 px-2 py-1 rounded">{totalReview + "/5 ("+numReviews + " reviews)"}</div>
              </div>
              <div style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="text-xl mt-5 w-full drop-shadow-lg pt-8 px-5 pb-1 mb-10">
              <div className='flex'>
                <h3 className='text-lg md:text-lg lg:text-3xl font-semibold mr-2'>Leave a review:</h3>
                <Rating onClick={handleRating} emptyStyle={{ display: "flex" }} fillStyle={{ display: "-webkit-inline-box" }}/>
              </div>
              <div className='grid grid-cols-1 gap-4 mb-4'>
                <textarea id={"comment_box_new"} role="textbox" className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700 h-30' placeholder='Comments (optional)' name='comment'></textarea>
              </div>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <input type="text" ref={nameEl} className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700' placeholder='Name' name='username' value={name} onChange={e => setName(e.target.value)}/>
                <input type="text" ref={emailEl} className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700' placeholder='Email (Optional)' name='email' value={email} onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className='grid grid-cols-1 gap-4 mb-4'>
                <div>
                  <input type="checkbox" ref={storeDataEl} className='h-3 rounded cursor-pointer' defaultChecked={saveData} onChange={e => {setSaveData(e.target.checked)}}/>
                  <label className='text-sm text-gray-500 px-2 select-none' htmlFor='storeData'>Save 'Name' and 'Email' for next time I comment.</label>
                </div>
                
              </div>
              <button style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white mr-4 px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={() => {handleReviewSubmission("new",null)}}>Post Review</button>
              {error && <p className='text-sm font-semibold text-red-500 mb-8'>*Please select a rating and fill out name!*</p>}
              {showSuccessMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Success!</p>}
              {showLoadingMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Submitting...</p>}
              </div>
              {localReviews.reviews.map((review, index_x) => {
              return (
                <div id={"comment_" + index_x + "-base"}>
                  <div style={{backgroundColor:"white", borderTop: "thin solid #FCA311", borderBottom: "thin solid #FCA311", marginTop: "-1px"}} className='grid grid-cols-1 gap-4'>
                    <div className='w-full flex py-10'>
                      <div className='w-1/6 mr-5 sm:mr-5 md:mr-0 lg:mr-0'>
                        <Gravatar default="identicon" email={review.email || review.name + "@email.com"} className='shadow-md rounded-lg' size={75}/>
                      </div>
                      <div className='w-5/6'>
                          <Rating size={15} initialValue={review.rating} readonly={true} emptyStyle={{ display: "flex" }} fillStyle={{ display: "-webkit-inline-box" }}/>
                          <h4 className='text-lg font-bold'>{review.name}</h4>
                          <p className='text-sm text-gray-400 pt-1'>{review.date}</p>
                          <p className='text-lg pt-9'>{review.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
            <div className="lg:w-64 md:w-64 lg:ml-auto md:ml-auto lg:-mr-6 md:-mr-6 hidden lg:block md:block mb-20">
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

export default BookDetails

//forcing dynamic page behavior to get new data from database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function getStaticProps({ params }) {
    const Data = await getSpecificBookOverview(params.slug)

    return {
      props: { Book: Data.Book, UpdateSchedule : Data.UpdateSchedule || [], Announcements : Data.Announcements || [] }
    }
}

export async function getStaticPaths() {
    const Data = await getAllBooksOverview();

    return {
      paths: Data.Books.map(({ node: { slug } }) => ({ params: { slug:slug } })),
      fallback: true,
    };
}

export const submitReview = async (review, location, slug) => {
  const result = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({review, location, slug})
  })

  return result.json()
}
