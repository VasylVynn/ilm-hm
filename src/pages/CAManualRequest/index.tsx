import { Box, Button, Container, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useData } from "./useData";
import Alert from "../../components/Alert";
import Header from "../../components/Header";

const CAManualRequest: React.FC = () => {

    const auth = useAuth();

    const {
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
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
                    <Typography variant="h5" color={'black'} component="h3" sx={{ marginBottom: '15px', whiteSpace: 'break-spaces' }}>
                        Стан серверу: {serverStatusText}
                    </Typography>
                </Box>
                <Box>
                    {/* <Typography variant="body1" color={'black'} component="h3" sx={{ marginBottom: '15px' }}>
                        Вкажіть посилання на список товарів h&m. Всі товари які є в цьому посиланні будуть перевірені на наявність розмірів і додані в розділ "Товари Member Prices".
                        Якщо в товарі є member price, тоді автоматично буде пораховано відсоток знижки та ціну з знижкою. Якщо member price відсутня тоді знижки вказано не буде.  </Typography>
                    <Typography variant="body1" color={'red'} component="h2" sx={{ marginBottom: '15px' }}>На даний момент перевірка товарів GB за посиланням не працює.</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px', maxWidth: '500px', gap: '20px' }}>
                        <TextField
                            sx={{ width: '100%' }}
                            label="Посилання"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                        <Button variant="contained" onClick={() => handleRequest({ customLink: '' })}>
                            Відправити
                        </Button>
                    </Box> */}
                    <Typography marginBottom={2} variant="body1" color={'black'} component="h3" sx={{ marginTop: '15px' }}>
                        Щоб перевірити товари C&A натисніть на відповідну кнопку нижче.
                    </Typography>
                    <Button variant="contained" sx={{ marginRight: '20px' }} onClick={() => handleRequest({ customLink: 'https://www.c-and-a.com/pl/pl/shop/wyprzedaz-dzieci' })}>
                        C&A SALE KIDS
                    </Button>
                    <Button variant="contained" onClick={() => handleRequest({ customLink: 'https://www.c-and-a.com/pl/pl/shop/wyprzedaz-niemowleta' })}>
                        C&A SALE BABY
                    </Button>

                </Box>
            </Container>
            <Alert
                title={!!error ? 'Помилка' : 'Успіх'}
                content={!!error ? error : status !== 'stopped' ? 'Запит успішно відправлено. Після обробки товари зявляться на сторінці "Товари Member Prices"' : 'Запит на зупинку виконано. Перевірку товарів буде зупинено'}
                confirmText="Oк"
                isOpen={!!error || !!status}
                onCancel={() => {
                    setError('');
                    setStatus('');
                }}
                onConfirm={() => {
                    setError('');
                    setStatus('');
                    window.location.reload();
                }}
            />

        </>
    );
}

export default CAManualRequest;
