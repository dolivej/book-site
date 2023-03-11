import React, {useRef, useState, useEffect} from 'react'
import Head from 'next/head'
import moment from 'moment';
import { Navbar, BookShowcase } from '../../components'
import { getChapter, getAllChapterSlugs } from '../../services'
import NextNProgress from 'nextjs-progressbar';
import Link from 'next/link'
import Gravatar from 'react-gravatar'
import { useRouter } from 'next/dist/client/router';

const navigation = [
  { name: 'All Books', href: '/', current: false },
  { name: 'Support', href: '/', current: false },
]

const ChapterPage = ({ Chapter }) => {
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
  
  const router = useRouter();

  const [localComments, setLocalComments] = useState(Chapter.comments || {comments:[]});
  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSucessMessage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveData, setSaveData] = useState(true);
  const nameEl = useRef();
  const emailEl = useRef();
  const storeDataEl = useRef();

  useEffect(() => {
    setLocalComments(Chapter.comments || {comments:[]})
    
    if(localStorage.getItem('bookSiteDataSave') == "true"){
      setEmail(localStorage.getItem('bookSiteEmail'))
      setName(localStorage.getItem('bookSiteName'))
    }else{
      setEmail("")
      setName("")
    }

    setSaveData(localStorage.getItem('bookSiteDataSave') == "true")
  },[router.asPath]);

  const handleCommentSubmission = (commentId,replyName) => {
    if(!(typeof window === "undefined")){
      setError(false)

      const comment = document.getElementById("comment_box_" + commentId).value

      var commentDateObj = new Date();  //.toString()
      const commentDate = commentDateObj.toString()

      const chapoterSlug = Chapter.slug

      if(!comment || !name) {
        setError(true)
        return;
      }

      const commentObj = { name, email, comment, chapoterSlug, commentDate, replyName, replies: [] }
      console.log(commentObj)
      setShowSucessMessage(true)

      if(saveData == true){
        window.localStorage.setItem('bookSiteDataSave', true);
        window.localStorage.setItem('bookSiteEmail', email);
        window.localStorage.setItem('bookSiteName', name);
      }else{
        window.localStorage.setItem('bookSiteDataSave', false);
      }
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
            <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded">{moment(Chapter.date).format('MMM D, YYYY')}</div>
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
              {showSuccessMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Posting...</p>}
          </div>

          <div className='mb-20'>
            {localComments.comments.map((comment, index_x) => {
              return (
                <div>
                  <div style={{backgroundColor:"white", borderTop: "thin solid #FCA311", borderBottom: "thin solid #FCA311"}} className='grid grid-cols-1 gap-4 mt-10'>
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
                              <button style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white mr-4 px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={() => {handleCommentSubmission(index_x + "-base",comment.name)}}>Post Reply</button>
                              <button style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={()=>{closeReplyPressed(index_x + "-base")}}>Cancel</button>
                            </div>
                            {error && <p className='text-sm font-semibold text-red-500 mb-8'>*Please fill out comment and name field!*</p>}
                            {showSuccessMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Posting...</p>}          
                          </div>
                      </div>
                    </div>
                  </div>
                  {comment.replies.map((reply,index_y) => {
                    return(
                      <div className='grid grid-cols-1 gap-4'>
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
                                  <button style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white mr-4 px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={() => {handleCommentSubmission(index_x + "-" + index_y,reply.name)}}>Post Reply</button>
                                  <button style={{backgroundColor:"#FCA311"}} className="lg:ml-0 text-normal font-semibold mt-0 mb-8 text-white px-4 py-2 rounded cursor-pointer ease-in-out duration-100 hover:drop-shadow-md active:drop-shadow-none" onClick={()=>{closeReplyPressed(index_x + "-" + index_y)}}>Cancel</button>
                                </div>
                                {error && <p className='text-sm font-semibold text-red-500 mb-8'>*Please fill out comment and name field!*</p>}
                                {showSuccessMessage && <p className='text-sm font-semibold text-green-500 mb-8'>Posting...</p>}          
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