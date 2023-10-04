import HomePage from './Home/Homepage'
import { LoginPage } from './Login/LoginPage'
import Settings from './components/Settings'
import { Edit, Home, Settings as SettingsIcon } from '@mui/icons-material'
import CreatePost from './createpost/CreatePost'

export type Page = {
  name: string
  icon: React.ReactNode
  elem: React.ReactNode
}

export const pages: Page[] = [
  {
    name: 'HomePage',
    icon: <Home />,
    elem: <HomePage/>
  },
  {
    name: 'Settings',
    icon: <SettingsIcon />,
    elem: <Settings />,
  },
  {
    name: 'CreatePost',
    icon: <Edit />,
    elem: <CreatePost/>
  },
  
]
