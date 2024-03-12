import { Typography, Box, AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import { cARoutes, hMRoutes, routes } from '../../App';
import { MouseEvent } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export const Header = () => {

    const auth = useAuth();
    const navigate = useNavigate();
    const [anchorElHM, setAnchorElHM] = useState<null | HTMLElement>(null);
    const [anchorElCA, setAnchorElCA] = useState<null | HTMLElement>(null);


    const handleLogout = () => {
        auth.logout();
        navigate('/');
    };

    const handleClickHM = (event: MouseEvent<HTMLButtonElement>): void => {
        setAnchorElHM(event.currentTarget);
    };

    const handleCloseHM = (path: string): void => {
        setAnchorElHM(null);
        navigate(path);
    };

    const handleClickCA = (event: MouseEvent<HTMLButtonElement>): void => {
        setAnchorElCA(event.currentTarget);
    };

    const handleCloseCA = (path: string): void => {
        setAnchorElCA(null);
        navigate(path);
    };

    return (
        <AppBar sx={{ backgroundColor: '#F2F2F2' }} position="static">
            <Toolbar >
                <Typography color='#1876D1' variant="h6" marginRight={6}>
                    {routes.find(route => route.path === window.location.pathname)?.name}
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', marginRight: 'auto', gap: '20px' }}>
                    <Button variant="contained" size='large' onClick={handleClickHM}>
                        H&M
                    </Button>
                    <Menu
                        anchorEl={anchorElHM}
                        open={Boolean(anchorElHM)}
                        onClose={handleCloseHM}
                    >
                        {hMRoutes.map((route) => (
                            <MenuItem onClick={() => handleCloseHM(route.path)}>{route.name}</MenuItem>
                        ))}
                    </Menu>
                    <Button variant="contained" size='large' onClick={handleClickCA}>
                        C&A
                    </Button>
                    <Menu
                        anchorEl={anchorElCA}
                        open={Boolean(anchorElCA)}
                        onClose={handleCloseCA}
                    >
                        {cARoutes.map((route) => (
                            <MenuItem onClick={() => handleCloseCA(route.path)}>{route.name}</MenuItem>
                        ))}
                    </Menu>
                </Box>
                <Button variant="contained" onClick={handleLogout}>
                    Вийти
                </Button>
            </Toolbar>
        </AppBar >);
};

export default Header;
