import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { useData } from './useData'
import ProductCard from '../../components/ProductCard'
import Alert from '../../components/Alert'
import Header from '../../components/Header'

const CAAuto: React.FC = () => {
  const auth = useAuth()

  const {
    sortedFilteredProducts,
    isConfirmDeleteModalOpen,
    setIsConfirmDeleteModalOpen,
    deleteProducts,
    sortBy,
    setSortBy,
    availableSizesFilter,
    setAvailableSizesFilter,
    isLoading,
    isRequestModalOpen,
    setIsRequestModalOpen,
    requestScraping,
    isDeleting,
    isRequesting
  } = useData()

  if (!auth.isLoading && auth.isLoggedIn === false) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Header />
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          {/* <TextField
            select
            label='Фільтр по країні'
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            style={{ margin: '10px', minWidth: '140px' }}
          >
            <MenuItem value='all'>Всі</MenuItem>
            <MenuItem value='PL'>PL</MenuItem>
          </TextField> */}
          {/* <TextField
            select
            label='Фільтр по категорії'
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ margin: '10px', minWidth: '140px' }}
          >
            <MenuItem value='all'>Всі</MenuItem>
            <MenuItem value='Wyprzedaż dzieci'>Dziecko</MenuItem>
            <MenuItem value='Wyprzedaż niemowlęta'>Niemowleta</MenuItem>
          </TextField> */}
          {/* <TextField
            select
            label='Фільтр по причині'
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            style={{ margin: '10px', minWidth: '140px' }}
          >
            <MenuItem value='all'>Всі</MenuItem>
            <MenuItem value='isNew'>Новий товар</MenuItem>
            <MenuItem value='isUpdated'>Змінилась ціна</MenuItem>
          </TextField> */}
          <TextField
            select
            label='Фільтр по кількості'
            value={availableSizesFilter}
            onChange={(e) => setAvailableSizesFilter(parseInt(e.target.value))}
            style={{ margin: '10px', minWidth: '140px' }}
          >
            <MenuItem value={0}>Будь-яка кількість</MenuItem>
            <MenuItem value={2}>{'>= 2'}</MenuItem>
            <MenuItem value={3}>{'>= 3'}</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <TextField
            select
            label='Сортувати за'
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ margin: '10px', minWidth: '140px' }}
          >
            <MenuItem value='salePercent'>Величиною знижки</MenuItem>
            <MenuItem value='dateAdding'>Датою додавання</MenuItem>
          </TextField>
          <Button
            variant='contained'
            sx={{ marginRight: '20px' }}
            onClick={() => setIsConfirmDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            Видалити товари
          </Button>
          <Button
            variant='contained'
            sx={{ marginRight: '20px' }}
            onClick={() => setIsRequestModalOpen(true)}
            disabled={isRequesting}
          >
            Запустити парсер
          </Button>
        </Box>

        <Typography gutterBottom variant='h5' color={'black'}>
          Кількість товарів: {sortedFilteredProducts.length}
        </Typography>
        {isLoading ? (
          <Typography variant='h5' color={'black'}>
            Завантаження...
          </Typography>
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {sortedFilteredProducts.map((product) => (
              <ProductCard
                type='cA'
                key={product?.articleCode || ''}
                product={product}
              />
            ))}
          </div>
        )}
      </Container>
      <Alert
        title='Натисніть щоб запустити парсер'
        content={isRequesting ? 'Парсер запущений, очікуйте...' : ''}
        cancelText={!isRequesting ? 'Скасувати' : undefined}
        confirmText={!isRequesting ? 'Підтвердити' : undefined}
        isOpen={isRequestModalOpen}
        onCancel={() => setIsRequestModalOpen(false)}
        onConfirm={requestScraping}
      />
      <Alert
        title='Ви впевнені що хочете видалити всі товари?'
        content={isDeleting ? 'Видалення товарів...' : ''}
        cancelText={!isDeleting ? 'Скасувати' : undefined}
        confirmText={!isDeleting ? 'Підтвердити' : undefined}
        isOpen={isConfirmDeleteModalOpen}
        onCancel={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={deleteProducts}
      />
    </>
  )
}

export default CAAuto
