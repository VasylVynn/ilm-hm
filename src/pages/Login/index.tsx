import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Paper, Snackbar, TextField, Typography } from "@mui/material";

const Login: React.FC = () => {
    const [alert, setAlert] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isLoggedIn) {
            navigate('/h-and-m');
        }
    }, [auth.isLoggedIn, navigate]);


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === import.meta.env.VITE_USERNAME && password === import.meta.env.VITE_PASSWORD) {
            auth.login();
            navigate('/h-and-m');
        } else {
            setAlert(true)
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
                <Typography variant="h4" style={{ marginBottom: '20px' }}> Логін</Typography>
                <form onSubmit={handleLogin}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Користувач"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Увійти
                    </Button>
                </form>
            </Paper>
            <Snackbar open={alert} autoHideDuration={6000} onClose={() => setAlert(false)}>
                <Alert onClose={() => setAlert(false)} severity="warning" sx={{ width: '100%' }}>
                    Не правильний логін або пароль!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;
