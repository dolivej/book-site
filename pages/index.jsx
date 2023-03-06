import Head from 'next/head'
import { Navbar, BookShowcase } from '../components'

const Books = [
  {
    title: "The Big Book",
    description: "The Empire stands triumphant. For twenty years the Dread Empress has ruled over the lands that were once the Kingdom of Callow, but behind the scenes of this dawning golden age threats to the crown are rising. The nobles of the Wasteland, denied the power they crave, weave their plots behind pleasant smiles. In the north the Forever King eyes the ever-expanding borders of the Empire and ponders war. The greatest danger lies to the west, where the First Prince of Procer has finally claimed her throne: her people sundered, she wonders if a crusade might not be the way to secure her reign. Yet none of this matters, for in the heart of the conquered lands the most dangerous man alive sat across an orphan girl and offered her a knife. Her name is Catherine Foundling, and she has a plan.",
    completed: false,
    wordCount: 22,
    cover: "https://edit.org/photos/images/cat/book-covers-big-2019101610.jpg-1300.jpg",
    chapters:[
      {
        title: "Prologue"
      },
    ]
  },
  {
    title: "The Big Book 2",
    description: "The Empire stands triumphant. For twenty years the Dread Empress has ruled over the lands that were once the Kingdom of Callow, but behind the scenes of this dawning golden age threats to the crown are rising. The nobles of the Wasteland, denied the power they crave, weave their plots behind pleasant smiles. In the north the Forever King eyes the ever-expanding borders of the Empire and ponders war. The greatest danger lies to the west, where the First Prince of Procer has finally claimed her throne: her people sundered, she wonders if a crusade might not be the way to secure her reign. Yet none of this matters, for in the heart of the conquered lands the most dangerous man alive sat across an orphan girl and offered her a knife. Her name is Catherine Foundling, and she has a plan.",
    completed: true,
    wordCount: 3,
    completedDate: "March 21, 2023",
    cover: "https://edit.org/photos/images/cat/book-covers-big-2019101610.jpg-1300.jpg",
    chapters:[
      {
        title: "Prologue"
      },
    ]
  },
  {
    title: "The Big Book 3",
    description: "The Empire stands triumphant. For twenty years the Dread Empress has ruled over the lands that were once the Kingdom of Callow, but behind the scenes of this dawning golden age threats to the crown are rising. The nobles of the Wasteland, denied the power they crave, weave their plots behind pleasant smiles. In the north the Forever King eyes the ever-expanding borders of the Empire and ponders war. The greatest danger lies to the west, where the First Prince of Procer has finally claimed her throne: her people sundered, she wonders if a crusade might not be the way to secure her reign. Yet none of this matters, for in the heart of the conquered lands the most dangerous man alive sat across an orphan girl and offered her a knife. Her name is Catherine Foundling, and she has a plan.",
    completed: true,
    wordCount: 15,
    completedDate: "March 21, 2023",
    cover: "https://edit.org/photos/images/cat/book-covers-big-2019101610.jpg-1300.jpg",
    chapters:[
      {
        title: "Prologue"
      },
    ]
  },
]

const Home = () => {
  return (
    <div>
      <Head>
        <title>David's Books</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar title="David's Books"/>
      <div className="flex mx-auto max-w-7xl pt-8">
        <div className="lg:w-4/5 md:w-3/4 sm:w-full px-12 sm:px-12 grid gap-20 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 lg:px-8">
          {Books.map((book) => <BookShowcase book={book} key={book.title} />)}
        </div>
        <div className="lg:w-1/5 md:w-1/4 hidden lg:block md:block">
          <div className="w-4/5 bg-gray-200 h-full ml-7">test</div>
        </div>
      </div>
    </div>
  )
}

export default Home
