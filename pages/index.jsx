import Head from 'next/head'
import { Navbar, BookShowcase } from '../components'
import { getAllBooksOverview } from '../services'

const navigation = [
  { name: 'All Books', href: '/', current: true },
  { name: 'Support', href: '/', current: false },
]

const Home = ({ Books }) => {
  return (
    <div>
      <Head>
        <title>David's Books</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar title="David's Books" target={'/'} navigation={navigation}/>
      {Books == undefined && <div></div>}
      {Books !== undefined &&       <div className="flex mx-auto max-w-7xl pt-8">
        <div className="lg:w-4/5 md:w-3/4 sm:w-full px-12 sm:px-12 grid gap-20 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 lg:px-8">
          {Books.map((book) => <BookShowcase book={book.node} key={book.node.title} />)}
        </div>
        <div className="lg:w-1/5 md:w-1/4 hidden lg:block md:block">
          <div className="w-4/5 bg-gray-200 h-full ml-7">test</div>
        </div>
      </div>}
    </div>
  )
}

export default Home

export async function getStaticProps() {
  const Books = (await getAllBooksOverview()) || [];

  return {
    props: { Books }
  }
}