import { Box, Container, MenuItem, TextField, Typography, Pagination, Button } from "@mui/material";
import { Navigate } from "react-router-dom";
import Alert from "../../components/Alert";
import { useAuth } from "../../AuthContext";
import { useData } from "./useData";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { useState } from "react";

const Carters: React.FC = () => {
    const cartersUrl = import.meta.env.VITE_CARTERS_URL

    const auth = useAuth();

    const {
        sortedFilteredProducts,
        isConfirmDeleteModalOpen,
        setIsConfirmDeleteModalOpen,
        categoryFilter,
        setCategoryFilter,
        handleDelete,
        sortBy,
        setSortBy,
        availableSizesFilter,
        setAvailableSizesFilter,
        isLoading,
        paginatedProducts,
        currentPage,
        totalPages,
        handlePageChange,
        type,
        setType
    } = useData();

    const SCRAPE_TYPES = ['sale', 'clearance'];
    // const [error, setError] = useState<string | null>(null);
    const [requestStatus, setRequestStatus] = useState<string | null>(null);
    const [scrapeType, setScrapeType] = useState<string>("clearance");
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
    const [scrapingStatus, setScrapingStatus] = useState<any>(null);
    const requestScraping = () => {
        setIsRequestModalOpen(false);
        fetch(`${cartersUrl}/carters/run-scraper`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `{"type":"${scrapeType}", "onlychecking":false}`
        })
            .then((response) => {
                if (response.status === 200) {
                    setRequestStatus('success');
                    console.log(response.status);
                } else {
                    console.log('Unexpected status code:', response.status);
                }
            })
            .catch(error => {
                throw new Error(`There was an error starting scraping: ${error}`);
            });
    };

    const checkScraping = () => {
        fetch(`${cartersUrl}/carters/run-scraper`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `{"type":"sale", "onlychecking":true}`
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setIsCheckModalOpen(true);
                setScrapingStatus(data);

            })
            .catch(error => {
                console.error(`There was an error starting scraping: ${error}`);
            });
    };



    if (!auth.isLoading && auth.isLoggedIn === false) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Header />
            <Container>
                <Box sx={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
                    <TextField
                        select
                        label="Фільтр по категорії"
                        value={categoryFilter}
                        onChange={(e) => {
                            handlePageChange(e, 1);
                            setCategoryFilter(e.target.value)
                        }}
                        style={{ margin: "10px", minWidth: "140px" }}
                    >
                        <MenuItem value="all">Всі</MenuItem>
                        <MenuItem value="Kid">Kid</MenuItem>
                        <MenuItem value="Toddler">Toddler</MenuItem>
                        <MenuItem value="Baby">Baby</MenuItem>

                    </TextField>
                    <TextField
                        select
                        label="Фільтр по типу (sale/clearance)"
                        value={type}
                        onChange={(e) => {
                            handlePageChange(e, 1);
                            setType(e.target.value)
                        }}
                        style={{ margin: "10px", minWidth: "210px" }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="sale">Sale</MenuItem>
                        <MenuItem value="clearance">Clearance</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Фільтр по кількості"
                        value={availableSizesFilter}
                        onChange={(e) => setAvailableSizesFilter(parseInt(e.target.value))}
                        style={{ margin: "10px", minWidth: "140px" }}
                    >
                        <MenuItem value={0}>Будь-яка кількість</MenuItem>
                        <MenuItem value={2}>{">= 2"}</MenuItem>
                        <MenuItem value={3}>{">= 3"}</MenuItem>
                        <MenuItem value={4}>{">= 4"}</MenuItem>
                        <MenuItem value={5}>{">= 5"}</MenuItem>
                    </TextField>
                    <Button variant="contained" sx={{ marginRight: '20px' }} onClick={() => setIsConfirmDeleteModalOpen(true)}>
                        Видалити товари
                    </Button>
                    <Button variant="contained" sx={{ marginRight: '20px' }} onClick={() => setIsRequestModalOpen(true)}>
                        Запустити парсер
                    </Button>
                    <Button variant="contained" sx={{ marginRight: '20px' }} onClick={() => checkScraping()}>
                        Перевірити статус парсера
                    </Button>
                </Box>
                <TextField
                    select
                    label="Сортувати за"
                    value={sortBy}
                    onChange={(e) => {
                        handlePageChange(e, 1);
                        setSortBy(e.target.value)
                    }}
                    style={{ margin: "10px", minWidth: "140px" }}
                >
                    <MenuItem value="salePercent">Величиною знижки</MenuItem>
                    <MenuItem value="dateAdding">Датою додавання</MenuItem>
                </TextField>

                <Typography gutterBottom variant="h5" color={"black"}>
                    Кількість товарів: {sortedFilteredProducts.length}
                </Typography>
                {isLoading ? (
                    <Typography variant="h5" color={"black"}>
                        Завантаження...
                    </Typography>
                ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                        {paginatedProducts.map((product) => (
                            <ProductCard type="carters" key={product.articleCode} product={product} />
                        ))}
                    </div>
                )}

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

            <Alert
                title="Ви впевнені що хочете видалити всі товари?"
                content="Будуть виладені всі товари Carters. Після видалення товари не можливо буде відновити!"
                cancelText="Скасувати"
                confirmText="Підтвердити"
                isOpen={isConfirmDeleteModalOpen}
                onCancel={() => setIsConfirmDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />

            {scrapingStatus && <Alert
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
            />}


            <Alert
                types={SCRAPE_TYPES}
                setScrapeType={setScrapeType}
                title="Оберіть категорію товарів для запуску парсера"
                content="Будуть виладені всі товари Carters. Після видалення товари не можливо буде відновити!"
                cancelText="Скасувати"
                confirmText="Підтвердити"
                isOpen={isRequestModalOpen}
                onCancel={() => setIsRequestModalOpen(false)}
                onConfirm={requestScraping}
            />

            <Alert
                title="Парсер запущено"
                content="Оновіть сторінку через 5-10 хвилин"
                confirmText="Підтвердити"
                isOpen={requestStatus === 'success'}
                onCancel={() => setRequestStatus(null)}
                onConfirm={() => setRequestStatus(null)} />


        </>
    );
};

export default Carters;
