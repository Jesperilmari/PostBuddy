import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { pages } from '../constants'

type SideNavProps = {
  changePage: (page: string) => void
  currentPage: string
}

export default function SideNav({ changePage, currentPage }: SideNavProps) {
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
              onClick={() => changePage(page.name)}
              selected={page.name == currentPage}
            >
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
