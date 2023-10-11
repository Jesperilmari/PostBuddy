import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import { PageName, pages } from '../constants'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../reducers/store'
import { changePage } from '../reducers/pageReducer'

export default function SideNav() {
  const currentPage = useSelector<RootState, PageName>((state) => state.page.name)
  const dispatch = useDispatch()
  const theme = useTheme()
  const handleChange = (page: PageName) => {
    dispatch(changePage(page))
  }
  return (
    <Drawer
      open
      variant="permanent"
      PaperProps={{
        style: {
          position: 'relative',
          zIndex: 0,
        },
      }}
      sx={{
        width: '16em',
        minHeight: '100vh',
      }}
    >
      <List>
        {pages.map((page) => (
          <ListItem
            key={page.name}
            sx={{
              padding: 0,
            }}
          >
            <ListItemButton
              onClick={() => handleChange(page.name)}
              selected={page.name == currentPage}
            >
              <ListItemIcon
              style={{
                color: theme.palette.text.secondary
              }}
              >
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
