import React from "react";

const BookShowcase = ({ book }) => {

    var imageStyle = {
        backgroundImage: 'url(' + book.cover + ')',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <>
            <div className="items-center justify-center">
                <a className="relative block group drop-shadow-md hover:drop-shadow-2xl" href="##">
                    <img className="relative" src={book.cover}/>
                    <div className="absolute inset-0 object-cover w-full h-full">
                        <div className="h-full">
                            <div className="transition-all transform 
                                translate-y-8 opacity-0 
                                group-hover:opacity-100 
                                group-hover:translate-y-0 h-full">
                                <div className="p-5 bg-white h-full">
                                    <p style={{maxHeight:"75%"}} className="text-normal text-black overflow-y-hidden">
                                        <b>The Empire stands triumphant.</b>
                                        <br/>
                                        <br/>
                                        {"For twenty years the Dread Empress has ruled over the lands that were once the Kingdom of Callow, but behind the scenes of this dawning golden age threats to the crown are rising. The nobles of the Wasteland, denied the power they crave, weave their plots behind pleasant smiles..."}
                                    </p>
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
                </a>
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