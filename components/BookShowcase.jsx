import React from "react";
import Link from 'next/link'

const BookShowcase = ({ book }) => {

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
        <>
            <div className="items-center justify-center">
                <Link className="relative block group drop-shadow-md hover:drop-shadow-2xl" href={"/books/"+book.slug}>
                    <img className="relative" src={book.cover.url}/>
                    <div className="absolute inset-0 object-cover w-full h-full">
                        <div className="h-full">
                            <div className="transition-all transform 
                                translate-y-8 opacity-0 
                                group-hover:opacity-100 
                                group-hover:translate-y-0 h-full">
                                <div className="p-5 bg-white h-full">
                                    <div style={{maxHeight:"75%"}} className="text-normal text-black overflow-y-hidden">
                                        {book.description.raw.children.map((typeObj, index) => {
                                            const children = typeObj.children.map((item, itemIndex) => {
                                                return getContentFragment(itemIndex, item.text, item)
                                            })

                                            return getContentFragment(index, children, typeObj, typeObj.type)
                                        })}
                                    </div>
                                    <p style={{maxHeight:"75%"}} className="text-normal text-black overflow-y-hidden">
                                        ...
                                    </p>
                                    <button style={{backgroundColor:"#FCA311"}} className="px-4 py-2 text-normal 
                                            text-white rounded font-bold mt-6">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="w-full text-center select-none">
                    <h2 className="text-2xl font-bold mt-3 mx-auto">{book.title}</h2>
                </div>
                <div className="flex select-none">
                    <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white ml-auto mr-2 px-2 py-1 rounded">{book.wordCount+"K words"}</div>
                    {book.completed && <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded">{"Completed"}</div>}
                    {!book.completed && <div style={{backgroundColor:"#FCA311"}} className="text-large mt-3 text-white mr-auto px-2 py-1 rounded">{"In Progress"}</div>}
                </div>
            </div>
        </>
    )
}

export default BookShowcase