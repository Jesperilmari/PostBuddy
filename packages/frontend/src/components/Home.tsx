import { useState } from 'react'
import MenuAppBar from './AppBar'
import SideNav from './SideNav'
import { pages } from '../constants'

function Home() {
  const [currentPage, setCurrentPage] = useState('Home')
  const page = pages.find((page) => page.name === currentPage)

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <MenuAppBar currentPage={currentPage} />
        <section
          style={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'row',
          }}
        >
          <SideNav changePage={setCurrentPage} currentPage={currentPage} />
          {page && page.elem}
        </section>
      </div>
    </>
  )
}

export default Home
