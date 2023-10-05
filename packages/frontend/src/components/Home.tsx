import { useEffect, useState } from 'react'
import MenuAppBar from './AppBar'
import SideNav from './SideNav'
import { pages } from '../constants'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../reducers/store'
import { Alert, AlertTitle } from '@mui/material'
import useAlert from '../Hooks/useAlert'

function Home() {
  const [currentPage, setCurrentPage] = useState('Home')
  const page = pages.find((page) => page.name === currentPage)
  const navigate = useNavigate()
  const user = useSelector<RootState>((state) => state.user.user)

  const alert = useAlert();
  

  console.log(alert);
  
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  
  const alertMessage = alert.alert.message
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Alert 
          severity={alert.alert.severity} 
          onClose={alert.alert.onClose ? () => {} : undefined}
          variant={alert.alert.variant}
          sx={{
            display: alert.active ? 'inherit' : 'none',
            position: 'absolute',
            minWidth: '500px',
            top: '10%',
            right: '5%',
            zIndex: 10,
          }}
          >{alert.alert.title ? <AlertTitle>{alert.alert.title}</AlertTitle> : null}
            {alertMessage}</Alert>
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
