import { Box, Button, Container, MenuItem, TextField, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useData } from "./useData";
import ProductCard from "../../components/ProductCard";
import Alert from "../../components/Alert";
import Header from "../../components/Header";

const MemberProducts: React.FC = () => {

    const auth = useAuth();

    const { deleteProduct,
        sortedFilteredProducts,
        regionFilter,
        setRegionFilter,
        isConfirmDeleteModalOpen,
        setIsConfirmDeleteModalOpen,
        categoryFilter,
        setCategoryFilter,
        handleDelete,
        sortBy,
        setSortBy,
        availableSizesFilter,
        setAvailableSizesFilter
    } = useData();





    if (!auth.isLoading && auth.isLoggedIn === false) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Header />
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
                        <MenuItem value="pl">PL</MenuItem>
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
                        <MenuItem value="dziecko">Dziecko</MenuItem>
                        <MenuItem value="niemowleta">Niemowleta</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Фільтр по кількості"
                        value={availableSizesFilter}
                        onChange={(e) => setAvailableSizesFilter(parseInt(e.target.value))}
                        style={{ margin: '10px', minWidth: '140px' }}
                    >
                        <MenuItem value={0}>Будь-яка кількість</MenuItem>
                        <MenuItem value={2}>{">= 2"}</MenuItem>
                        <MenuItem value={3}>{">= 3"}</MenuItem>
                    </TextField>
                    <Button variant="contained" onClick={() => setIsConfirmDeleteModalOpen(true)}>
                        Видалити всі товари
                    </Button>
                </Box>
                <TextField
                    select
                    label="Сортувати за"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ margin: '10px', minWidth: '140px' }}
                >
                    <MenuItem value="salePercent">Величиною знижки</MenuItem>
                    <MenuItem value="dateAdding">Датою додавання</MenuItem>
                </TextField>

                <Typography gutterBottom variant="h5" color={'black'} >
                    Кількість товарів: {sortedFilteredProducts.length}
                </Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {sortedFilteredProducts.map(product => (
                        <ProductCard key={product.articleCode} product={product} onDelete={deleteProduct} />
                    ))}
                </div>
            </Container>
            <Alert
                title="Ви впевнені що хочете видалити всі товари?"
                content=" Будуть виладені всі товари які зараз відфільтровані,
                або всі товари якщо фільтри не обрано.
                Після видалення товари не можливо буде відновити!"
                cancelText="Скасувати"
                confirmText="Підтвердити"
                isOpen={isConfirmDeleteModalOpen} onCancel={() => setIsConfirmDeleteModalOpen(false)} onConfirm={handleDelete} />        </>
    );
}

export default MemberProducts;
