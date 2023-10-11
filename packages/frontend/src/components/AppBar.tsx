import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../reducers/store'
import { User } from '../interfaces'
import { userLoggedOut } from '../reducers/userReducer'
import { useTheme } from '@mui/material'

export default function MenuAppBar({ currentPage }: { currentPage: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const user = useSelector<RootState>((state) => state.user.user) as User
  const dispatch = useDispatch()
  const theme = useTheme()
  const main = theme.palette.primary.main
  const target = '#00363e'

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(userLoggedOut())
    handleClose()
  }

  return (
    <Box sx={{ flexGrow: 0, zIndex: 1 }}>
      <AppBar
        className="bar"
        position="static"
        sx={{
          background: `linear-gradient(90deg, ${main} 0%, ${target} 100%)`,
        }}
      >
        {' '}
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {currentPage}
          </Typography>
          {user && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                style = {{color: "white"}}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
