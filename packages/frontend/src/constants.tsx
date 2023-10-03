import Settings from './components/Settings'
import { Settings as SettingsIcon } from '@mui/icons-material'

export type Page = {
  name: string
  icon: React.ReactNode
  elem: React.ReactNode
}

export const pages: Page[] = [
  {
    name: 'Settings',
    icon: <SettingsIcon />,
    elem: <Settings />,
  },
]
