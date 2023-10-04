import { useEffect, useState } from 'react'
import MenuAppBar from './AppBar'
import SideNav from './SideNav'
import { pages } from '../constants'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../reducers/store'

function Home() {
  const [currentPage, setCurrentPage] = useState('Home')
  const page = pages.find((page) => page.name === currentPage)
  const navigate = useNavigate()
  const user = useSelector<RootState>((state) => state.user.user)
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])
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
