import { Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import { routes } from '../../App';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';


export const Header = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate('/');
    };

    return (
        <AppBar sx={{ backgroundColor: '#F2F2F2' }} position="static">
            <Toolbar >
                <Typography color='#1876D1' variant="h6" marginRight={6}>
                    Товари H&M
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', marginRight: 'auto' }}>
                    {routes.slice(1, 4).map((page) => (
                        <Button
                            key={page.path}
                            onClick={() => navigate(page.path)}
                            variant={page.path === window.location.pathname ? 'contained' : 'outlined'}
                            sx={{ marginRight: '10px' }}
                        >
                            {page.name}
                        </Button>
                    ))}
                </Box>
                <Button variant="contained" onClick={handleLogout}>
                    Вийти
                </Button>
            </Toolbar>
        </AppBar >);
};

export default Header;
