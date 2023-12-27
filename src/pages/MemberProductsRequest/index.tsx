import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useData } from "./useData";
import Alert from "../../components/Alert";
import Header from "../../components/Header";

const MemberProductsRequest: React.FC = () => {

    const auth = useAuth();

    const { link,
        setLink,
        handleRequest,
        error,
        setError,
        status,
        setStatus,
        serverStatusText

    } = useData();


    if (!auth.isLoading && auth.isLoggedIn === false) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Header />
            <Container>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                    <Typography variant="h5" color={'black'} component="h3" sx={{ marginBottom: '15px' }}>
                        Стан серверу: {serverStatusText}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1" color={'black'} component="h3" sx={{ marginBottom: '15px' }}>
                        Вкажіть посилання на список товарів h&m. Всі товари які є в цьому посиланні будуть перевірені на наявність розмірів і додані в розділ "Товари Member Prices".
                        Якщо в товарі є member price, тоді автоматично буде пораховано відсоток знижки та ціну з знижкою. Якщо member price відсутня тоді знижки вказано не буде.  </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px', maxWidth: '500px', gap: '20px' }}>
                        <TextField
                            sx={{ width: '100%' }}
                            label="Посилання"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleRequest}>
                            Відправити
                        </Button>
                    </Box>
                </Box>




            </Container>
            <Alert
                title={!!error ? 'Помилка' : 'Успіх'}
                content={!!error ? error : 'Запит успішно відправлено. Після обробки товари зявляться на сторінці "Товари Member Prices"'}
                confirmText="Oк"
                isOpen={!!error || !!status}
                onCancel={() => {
                    setError('');
                    setStatus('');
                }}
                onConfirm={() => {
                    setError('');
                    setStatus('');
                }}
            />        </>
    );
}

export default MemberProductsRequest;
