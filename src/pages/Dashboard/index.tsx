import { AppBar, Box, Button, Container, MenuItem, TextField, Toolbar, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useData } from "./useData";
import ProductCard from "../../components/ProductCard";
import Alert from "../../components/Alert";

const Dashboard: React.FC = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    const { deleteProduct,
        sortedFilteredProducts,
        regionFilter,
        setRegionFilter,
        isConfirmDeleteModalOpen,
        setIsConfirmDeleteModalOpen,
        categoryFilter,
        setCategoryFilter,
        reasonFilter,
        setReasonFilter,
        handleDelete
    } = useData();



    const handleLogout = () => {
        auth.logout();
        navigate('/');
    };

    if (!auth.isLoggedIn) {
        return <Navigate to="/" />;
    }
    console.log('Category Filter:', categoryFilter);
    console.log('Filtered Products Length:', sortedFilteredProducts.length);
    return (
        <>
            <AppBar sx={{ backgroundColor: '#F2F2F2' }} position="static">
                <Toolbar >
                    <Typography color='#d21919' variant="h6" style={{ flexGrow: 1 }}>
                        Товари H&M ТЕСТ
                    </Typography>
                    <Button variant="contained" onClick={handleLogout}>
                        Вийти
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                    <TextField
                        select
                        label="Фільтр по країні"
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        style={{ margin: '10px', minWidth: '140px' }}
                    >
                        <MenuItem value="all">Всі</MenuItem>
                        <MenuItem value="us">US</MenuItem>
                        <MenuItem value="gb">GB</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Фільтр по категорії"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ margin: '10px', minWidth: '140px' }}
                    >
                        <MenuItem value="all">Всі</MenuItem>
                        <MenuItem value="kids">Kids</MenuItem>
                        <MenuItem value="baby">Baby</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Фільтр по причині"
                        value={reasonFilter}
                        onChange={(e) => setReasonFilter(e.target.value)}
                        style={{ margin: '10px', minWidth: '140px' }}
                    >
                        <MenuItem value="all">Всі</MenuItem>
                        <MenuItem value="isNew">Новий товар</MenuItem>
                        <MenuItem value="isUpdated">Змінилась ціна</MenuItem>
                    </TextField>
                    <Button variant="contained" onClick={() => setIsConfirmDeleteModalOpen(true)}>
                        Видалити всі товари
                    </Button>
                </Box>

                <Typography gutterBottom variant="h5" color={'black'} >
                    Кількість товарів: {sortedFilteredProducts.length}
                </Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {sortedFilteredProducts.map(product => (
                        <ProductCard key={product.articleCode} product={product} onDelete={deleteProduct} />
                    ))}
                </div>
            </Container>
            <Alert isOpen={isConfirmDeleteModalOpen} onCancel={() => setIsConfirmDeleteModalOpen(false)} onConfirm={handleDelete} />
        </>
    );
}

export default Dashboard;
