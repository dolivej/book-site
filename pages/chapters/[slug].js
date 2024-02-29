import React, {useRef, useState, useEffect} from 'react'
import Head from 'next/head'
import moment from 'moment';
import { Navbar } from '../../components'
import { getChapter, getAllChapterSlugs } from '../../services'
import NextNProgress from 'nextjs-progressbar';
import Link from 'next/link'
import Gravatar from 'react-gravatar'
import { useRouter } from 'next/dist/client/router';
import supabase from '../../supabase/public'

const navigation = [
  { name: 'All Books', href: '/', current: false },
  { name: 'Support', href: '/support/support', current: false },
]

const ChapterPage = ({ Chapter, UpdateSchedule, Announcements, url }) => {

  // const [Chapter, setChapter] = useState(ChapterStatic)
  // const [UpdateSchedule, setUpdateSchedule] = useState(UpdateScheduleStatic || [])
  // const [Announcements, setAnnouncements] = useState(AnnouncementsStatic || [])

  // console.log("Refreshing Data...")
  // useEffect(() => {
  //   // declare the data fetching function
  //   const fetchData = async () => {
  //     const Data = (await getChapter(url)) || {};
  //     setChapter({...(Data.Chapter)})
  //     setUpdateSchedule(Data.UpdateSchedule || [])
  //     setAnnouncements(Data.Announcements || [])
  //     console.log(Data.Chapter)
  //     console.log("Data Refreshed!")
  //   }
  
  //   // call the function
  //   fetchData()
  // }, [url])

  
  if(Chapter == undefined){
    return (
        <div>
          <Head>
            <title>{"Grimdark Books - Woops!"}</title>
            <link rel="icon" href="/favicon.ico" />
            <script>
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              
                ttq.load('CNGCOBBC77U11V19DEP0');
                ttq.page();
              }(window, document, 'ttq');
            </script>
          </Head>
          <Navbar title={"Woops!"} target={"/"} navigation={navigation}/>
        </div>
      ) 
  }

  const router = useRouter();

  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [localComments, setLocalComments] = useState(Chapter.comments || {comments:[]});
  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSucessMessage] = useState(false);
  const [showLoadingMessage, setLoadingMessage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveData, setSaveData] = useState(true);
  const nameEl = useRef();
  const emailEl = useRef();
  const storeDataEl = useRef();
  const [views, setViews] = useState(69)

  useEffect(() => {
    setLocalComments(Chapter.comments || {comments:[]})
    setError(false)
    setShowSucessMessage(false)
    setIsAnnouncementOpen(false)

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

  },[router.asPath]);

  const handleCommentSubmission = (commentId,replyName) => {
    if(!(typeof window === "undefined")){
      setError(false)

      const comment = document.getElementById("comment_box_" + commentId).value

      var commentDateObj = new Date();  //.toString()
      const commentDate = commentDateObj.toString()

      if(!comment || !name) {
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

      const commentObj = { 
        name, 
        email, 
        content: comment, 
        date: commentDate, 
        replyName, 
        replies: [] 
      }

      setLoadingMessage(true)

      submitComment(commentObj, commentId, Chapter.slug)
        .then((res) => {
          setLoadingMessage(false)
          setShowSucessMessage(true)

          setLocalComments(res.comments)
          setTimeout(() => {
            setShowSucessMessage(false)

            var x_position = res.comments.comments.length-1

            if(commentId == "new"){
              document.getElementById("comment_" + x_position + "-base").scrollIntoView();
            }else{
              var locations = commentId.split("-")
              x_position = parseInt(locations[0])
              var y_position = res.comments.comments[x_position].replies.length-1

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

  const replyPressed = (parentId) => {
    if(!(typeof window === "undefined")){
      setError(false)
      const replyBox = document.getElementById("reply_display_" + parentId)

      
      replyBox.style.display = replyBox.style.display == "none" ||  replyBox.style.display == "" ? "block" : "none"
    }
  }

  const closeReplyPressed = (parentId) => {
    if(!(typeof window === "undefined")){
      setError(false)
      const replyBox = document.getElementById("reply_display_" + parentId)
      replyBox.style.display = "none"
    }
  }

  return (
    <div>
      <Head>
        <title>{"Grimdark Books - " + Chapter.book.title + " - " + Chapter.title}</title>
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
      <div className="flex max-w-7xl pt-8 mx-auto px-8">
        <div className="max-w-3xl">
          <div className="flex select-none mt-1 text-xs text-gray-300 underline cursor-pointer">
            {Chapter.previousChapter && <Link href={"/chapters/" + Chapter.previousChapter.slug} className="text-large mt-3 mr-4 py-1 hover:text-black ease-in-out duration-100">Previous Chapter</Link>}
            {Chapter.nextChapter && <Link href={"/chapters/" + Chapter.nextChapter.slug} className="text-large mt-3 mr-auto py-1 hover:text-black ease-in-out duration-100">Next Chapter</Link>}
          </div>
          <h1 className='font-bold text-5xl mt-2'>{Chapter.title}</h1>
          <div className="flex select-none mt-1 text-lg font-semibold">
            <div style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-large mt-3 text-white mr-2 px-2 py-1 rounded">{Chapter.authors[0].name}</div>
            <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-2 px-2 py-1 rounded">{moment(Chapter.date).format('MMM D, YYYY')}</div>
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

          <h1 className='font-bold text-5xl mt-20'>Comments</h1>
          <div style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="text-xl mt-5 w-full drop-shadow-lg pt-8 px-5 pb-1">
              <h3 className='text-2xl font-semibold'>Leave a comment</h3>
              <div className='grid grid-cols-1 gap-4 mb-4'>
                <textarea id={"comment_box_new"} role="textbox" className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700 h-40' placeholder='Comment' name='comment'></textarea>
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
              <button style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white mr-4 px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={() => {handleCommentSubmission("new",null)}}>Post Comment</button>
              {error && <p className='text-sm font-semibold text-red-500 mb-8'>*Please fill out comment and name field!*</p>}
              {showSuccessMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Success!</p>}
              {showLoadingMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Posting...</p>}
          </div>

          <div className='mb-20 mt-10'>
            {localComments.comments.map((comment, index_x) => {
              return (
                <div id={"comment_" + index_x + "-base"}>
                  <div style={{backgroundColor:"white", borderTop: "thin solid #FCA311", borderBottom: "thin solid #FCA311", marginTop: "-1px"}} className='grid grid-cols-1 gap-4'>
                    <div className='w-full flex py-10'>
                      <div className='w-1/6 mr-5 sm:mr-5 md:mr-0 lg:mr-0'>
                        <Gravatar default="identicon" email={comment.email || comment.name + "@email.com"} className='shadow-md rounded-lg' size={75}/>
                      </div>
                      <div className='w-5/6'>
                          <h4 className='text-lg font-bold'>{comment.name}</h4>
                          <p className='text-sm text-gray-400 pt-1'>{comment.date}</p>
                          <p className='text-lg pt-9'>{comment.content}</p>

                          <div className='text-sm pt-9 underline font-semibold cursor-pointer w-10 ease-in-out duration-100 hover:drop-shadow-md' onClick={()=>{replyPressed(index_x + "-base")}}>Reply</div>

                          <div id={'reply_display_' + index_x + "-base"} style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="hidden text-xl mt-5 w-full drop-shadow-lg pt-8 px-5 pb-1">
                            <h3 className='text-2xl font-semibold'>{"Reply to @" + comment.name}</h3>
                            <div className='grid grid-cols-1 gap-4 mb-4'>
                              <textarea id={"comment_box_" + index_x + "-base"} role="textbox" className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700 h-40' placeholder='Comment' name='comment'></textarea>
                            </div>
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                              <input type="text" ref={nameEl} className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700' placeholder='Name' name='username' value={name} onChange={e => setName(e.target.value)}/>
                              <input type="text" ref={emailEl} className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700' placeholder='Email (Optional)' name='email' value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div className='grid grid-cols-1 gap-4 mb-4'>
                              <div>
                                <input type="checkbox" ref={storeDataEl} className='h-3 rounded cursor-pointer' id='storeData' name='storeData' defaultChecked={saveData} onChange={e => {setSaveData(e.target.checked)}}/>
                                <label className='text-sm text-gray-500 px-2 select-none' htmlFor='storeData'>Save 'Name' and 'Email' for next time I comment.</label>
                              </div>
                              
                            </div>
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                              <button style={{backgroundColor:"#FCA311"}} className="text-sm sm:text-lg md:text-lg lg:text-lg lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white mr-4 px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={() => {handleCommentSubmission(index_x + "-base",comment.name)}}>Post Reply</button>
                              <button style={{backgroundColor:"#FCA311"}} className="text-sm sm:text-lg md:text-lg lg:text-lg lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={()=>{closeReplyPressed(index_x + "-base")}}>Cancel</button>
                            </div>
                            {error && <p className='text-sm font-semibold text-red-500 mb-8'>*Please fill out comment and name field!*</p>}
                            {showSuccessMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Success!</p>}
                            {showLoadingMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Posting...</p>}       
                          </div>
                      </div>
                    </div>
                  </div>
                  {comment.replies.map((reply,index_y) => {
                    return(
                      <div id={"comment_" + index_x + "-" + index_y} className='grid grid-cols-1 gap-4'>
                        <div style={{borderBottom: "thin solid #FCA311"}} className='ml-auto w-5/6 flex py-10'>
                          <div className='w-1/6 mr-5 sm:mr-5 md:mr-0 lg:mr-0'>
                            <Gravatar default="identicon" email={reply.email || reply.name + "@email.com"} className='shadow-md rounded-lg' size={75}/>
                          </div>
                          <div className='w-5/6'>
                              <h4 className='text-lg font-bold'>{reply.name}</h4>
                              <p className='text-sm text-gray-400 pt-1'>{reply.date}</p>
                              <p className='text-lg pt-9'><b>@{reply.replyName}</b> {reply.content}</p>

                              <div className='text-sm pt-9 underline font-semibold cursor-pointer w-10 ease-in-out duration-100 hover:drop-shadow-md' onClick={()=>{replyPressed(index_x + "-" + index_y)}}>Reply</div>

                              <div id={'reply_display_' + index_x + "-" + index_y} style={{backgroundColor:"white", borderTop: "thick double #FCA311", borderBottom: "thick double #FCA311"}} className="hidden text-xl mt-5 w-full drop-shadow-lg pt-8 px-5 pb-1">
                                <h3 className='text-2xl font-semibold'>{"Reply to @" + reply.name}</h3>
                                <div className='grid grid-cols-1 gap-4 mb-4'>
                                  <textarea id={"comment_box_" + index_x + "-" + index_y} role="textbox" className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700 h-40' placeholder='Comment' name='comment'></textarea>
                                </div>
                                <div className='grid grid-cols-2 gap-4 mb-4'>
                                  <input type="text" ref={nameEl} className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700' placeholder='Name' name='username' value={name} onChange={e => setName(e.target.value)}/>
                                  <input type="text" ref={emailEl} className='p-4 outline-none w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 text-sm mt-4 text-gray-700' placeholder='Email (Optional)' name='email' value={email} onChange={e => setEmail(e.target.value)}/>
                                </div>
                                <div className='grid grid-cols-1 gap-4 mb-4'>
                                  <div>
                                    <input type="checkbox" ref={storeDataEl} className='h-3 rounded cursor-pointer' id='storeData' name='storeData' value="true" defaultChecked={saveData} onChange={e => {setSaveData(e.target.checked)}}/>
                                    <label className='text-sm text-gray-500 px-2 select-none' htmlFor='storeData'>Save 'Name' and 'Email' for next time I comment.</label>
                                  </div>
                                  
                                </div>
                                <div className='grid grid-cols-2 gap-4 mb-4'>
                                  <button style={{backgroundColor:"#FCA311"}} className="text-xs sm:text-lg md:text-lg lg:text-lg lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white mr-4 px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={() => {handleCommentSubmission(index_x + "-" + index_y,reply.name)}}>Post Reply</button>
                                  <button style={{backgroundColor:"#FCA311"}} className="text-xs sm:text-lg md:text-lg lg:text-lg lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={()=>{closeReplyPressed(index_x + "-" + index_y)}}>Cancel</button>
                                </div>
                                {error && <p className='text-sm font-semibold text-red-500 mb-8'>*Please fill out comment and name field!*</p>}
                                {showSuccessMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Success!</p>}
                                {showLoadingMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Posting...</p>}          
                              </div>
                          </div>                         
                        </div>    
                      </div>
                    )
                  })}
                </div>
              )
            })}

          {/* <div>
            <div style={{backgroundColor:"white", borderTop: "thin solid #FCA311", borderBottom: "thin solid #FCA311"}} className='grid grid-cols-1 gap-4 mt-10'>
              <div className='w-full flex py-10'>
                <div className='w-1/6 mr-5 sm:mr-5 md:mr-0 lg:mr-0'>
                  <Gravatar default="identicon" email="a-email@example.com" className='shadow-md rounded-lg' size={75}/>
                </div>
                <div className='w-5/6'>
                    <h4 className='text-lg font-bold'>BigPerson22</h4>
                    <p className='text-sm text-gray-400 pt-1'>Mar 10, 2023 @ 11:10am</p>
                    <p className='text-lg pt-9'>I really like this book wowza!</p>

                    <p className='text-sm pt-9 underline font-semibold cursor-pointer w-10 ease-in-out duration-100 hover:drop-shadow-md'>Reply</p>
                </div>
              </div>
            </div>
            <div style={{backgroundColor:"white", borderBottom: "thin solid #FCA311"}} className='grid grid-cols-1 gap-4'>
              <div className='ml-auto w-5/6 flex py-10'>
                <div className='w-1/6 mr-5 sm:mr-5 md:mr-0 lg:mr-0'>
                  <Gravatar default="identicon" email="a-email3@example.com" className='shadow-md rounded-lg' size={75}/>
                </div>
                <div className='w-5/6'>
                    <h4 className='text-lg font-bold'>Some Dude</h4>
                    <p className='text-sm text-gray-400 pt-1'>Mar 10, 2023 @ 11:15am</p>
                    <p className='text-lg pt-9'><b>@BigPerson22</b> I agree!</p>

                    <p className='text-sm pt-9 underline font-semibold cursor-pointer w-10 ease-in-out duration-100 hover:drop-shadow-md'>Reply</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style={{backgroundColor:"white", borderBottom: "thin solid #FCA311"}} className='grid grid-cols-1 gap-4'>
              <div className='w-full flex py-10'>
                <div className='w-1/6 mr-5 sm:mr-5 md:mr-0 lg:mr-0'>
                  <Gravatar default="identicon" email="a-email2@example.com" className='shadow-md rounded-lg' size={75}/>
                </div>
                <div className='w-5/6'>
                    <h4 className='text-lg font-bold'>Other Person</h4>
                    <p className='text-sm text-gray-400 pt-1'>Mar 10, 2023 @ 11:10am</p>
                    <p className='text-lg pt-9'>I really like this book wowza!</p>

                    <p className='text-sm pt-9 underline font-semibold cursor-pointer w-10 ease-in-out duration-100 hover:drop-shadow-md'>Reply</p>
                </div>
              </div>
            </div>
          </div> */}
          </div>
        </div>
        <div className="pt-6 lg:w-64 md:w-64 lg:ml-auto md:ml-auto lg:-mr-6 md:-mr-6 hidden lg:block md:block mb-20">
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

export default ChapterPage

export async function getStaticProps({ params }) {
  const Data = await getChapter(params.slug)

  return {
    props: { Chapter: Data.Chapter, UpdateSchedule : Data.UpdateSchedule || [], Announcements : Data.Announcements || [], url: params.slug}
  }
}

export async function getStaticPaths() {
  const Chapters = await getAllChapterSlugs();

  return {
    paths: Chapters.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: true,
  };
}

export const submitComment = async (comment, location, slug) => {
  const result = await fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({comment, location, slug})
  })

  return result.json()
}
