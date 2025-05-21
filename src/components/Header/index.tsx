import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem
} from '@mui/material'
import { cARoutes, routes } from '../../App'
import { useAuth } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const Header = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [anchorElCA, setAnchorElCA] = useState<null | HTMLElement>(null)

  const handleLogout = () => {
    auth.logout()
    navigate('/')
  }

  const handleCloseCA = (path: string): void => {
    setAnchorElCA(null)
    navigate(path)
  }

  return (
    <AppBar sx={{ backgroundColor: '#F2F2F2' }} position='static'>
      <Toolbar>
        <Typography color='#1876D1' variant='h6' marginRight={6}>
          {
            routes.find((route) => route.path === window.location.pathname)
              ?.name
          }
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            marginRight: 'auto',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate('/h-and-m')}
          >
            H&M
          </Button>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate('/c-and-a-auto')}
          >
            C&A
          </Button>
          <Menu
            anchorEl={anchorElCA}
            open={Boolean(anchorElCA)}
            onClose={handleCloseCA}
          >
            {cARoutes.map((route) => (
              <MenuItem
                key={route.path}
                onClick={() => handleCloseCA(route.path)}
              >
                {route.name}
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate('/carters')}
          >
            Carters
          </Button>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate('/smyk')}
          >
            Smyk
          </Button>
        </Box>
        <Button variant='contained' onClick={handleLogout}>
          Вийти
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
