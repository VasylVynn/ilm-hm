import { Box, Button, Container, MenuItem, Pagination, TextField, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useData } from "./useData";
import ProductCard from "../../components/ProductCard";
import Alert from "../../components/Alert";
import Header from "../../components/Header";

const Dashboard: React.FC = () => {

    const auth = useAuth();

    const {
        paginatedProducts,
        sortedFilteredProducts,
        regionFilter,
        setRegionFilter,
        isConfirmDeleteModalOpen,
        setIsConfirmDeleteModalOpen,
        categoryFilter,
        setCategoryFilter,
        deleteProducts,
        sortBy,
        setSortBy,
        availableSizesFilter,
        setAvailableSizesFilter,
        isLoading,
        requestScraping,
        checkstatus,
        requestStatus,
        // isRequestModalOpen,
        setRequestStatus,
        handleDelete,
        deleteStatus,
        handlePageChange,
        currentPage,
        totalPages
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
                        onChange={(e) => {
                            handlePageChange(e, 1);
                            setRegionFilter(e.target.value)
                        }}
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
                        onChange={(e) => {
                            handlePageChange(e, 1);
                            setCategoryFilter(e.target.value)
                        }}
                        style={{ margin: '10px', minWidth: '140px' }}
                    >
                        <MenuItem value="all">Всі</MenuItem>
                        <MenuItem value="Newborn">Newborn</MenuItem>
                        <MenuItem value="Baby">Baby</MenuItem>
                        <MenuItem value="Kids 2-8">Kids 2-8</MenuItem>
                        <MenuItem value="Kids 9-14">Kids 9-14</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Фільтр по кількості"
                        value={availableSizesFilter}
                        onChange={(e) => {
                            handlePageChange(e, 1);
                            setAvailableSizesFilter(parseInt(e.target.value))
                        }}
                        style={{ margin: '10px', minWidth: '140px' }}
                    >
                        <MenuItem value={0}>Будь-яка кількість</MenuItem>
                        <MenuItem value={2}>{">= 2"}</MenuItem>
                        <MenuItem value={3}>{">= 3"}</MenuItem>
                        <MenuItem value={4}>{">= 4"}</MenuItem>
                        <MenuItem value={5}>{">= 5"}</MenuItem>
                    </TextField>
                </Box>
                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px' }}>

                    <Button variant="contained" onClick={requestScraping}>
                        Запсутити
                    </Button>
                    <Button variant="contained" onClick={handleDelete}>
                        Видалити товари
                    </Button>
                    <Button variant="contained" onClick={checkstatus}>
                        Перевірити статус                    </Button>
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
                {isLoading ? <Typography variant="h5" color={'black'} >Завантаження...</Typography> : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {paginatedProducts.map(product => (
                        <ProductCard key={product.articleCode} product={product} />
                    ))}
                </div>}
                {/* Pagination Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', paddingBottom: '40px' }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                    />
                </Box>
            </Container>

            {/* {scrapingStatus && <Alert
                title="Статус парсера"
                content={
                    <div>
                        <p>
                            Парсер запущено: {scrapingStatus.is_scraper_running
                                ? "Так" : "Ні"}
                        </p>
                        <p>
                            Прогрес: {scrapingStatus.progres}
                        </p>
                    </div>}
                confirmText="Закрити"
                isOpen={isCheckModalOpen}
                onCancel={() => setIsCheckModalOpen(false)}
                onConfirm={() => setIsCheckModalOpen(false)}
            />} */}
            <Alert
                title="Парсер запущено"
                content="Оновіть сторінку через 5-10 хвилин"
                confirmText="Підтвердити"
                isOpen={requestStatus === 'success'}
                onCancel={() => setRequestStatus(null)}
                onConfirm={() => setRequestStatus(null)} />
            <Alert
                title="Ви впевнені що хочете видалити всі товари?"
                content={deleteStatus ? deleteStatus : "Будуть виладені всі товари H&M. Після видалення товари не можливо буде відновити!"}
                cancelText="Скасувати"
                confirmText="Підтвердити"
                isOpen={isConfirmDeleteModalOpen} onCancel={() => setIsConfirmDeleteModalOpen(false)} onConfirm={deleteProducts} />
        </>
    );
}

export default Dashboard;
