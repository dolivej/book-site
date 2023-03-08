import Head from 'next/head'
import { Navbar, BookShowcase } from '../../components'
import { getAllBooksOverview } from '../../services'

const navigation = [
  { name: 'All Books', href: '/', current: true },
  { name: 'Support', href: '/', current: false },
]

const Chapter = ({ Books }) => {
  return (
    <div>
      <Head>
        <title>David's Books - Book - Chapter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar title="David's Books" target={'/'} navigation={navigation}/>
      <div className="flex mx-auto max-w-7xl pt-8">
        chapter
      </div>
    </div>
  )
}

export default Chapter