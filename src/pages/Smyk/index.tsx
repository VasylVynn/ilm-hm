import {
  Box,
  Container,
  TextField,
  Typography,
  Pagination,
  Button
} from '@mui/material'
import { Navigate } from 'react-router-dom'
import Alert from '../../components/Alert'
import { useAuth } from '../../AuthContext'
import { useData } from './useData'
import ProductCard from '../../components/ProductCard'
import Header from '../../components/Header'
import { useState } from 'react'

const Smyk: React.FC = () => {
  const cartersUrl = import.meta.env.VITE_CARTERS_URL
  const auth = useAuth()

  const {
    products,
    isConfirmDeleteModalOpen,
    setIsConfirmDeleteModalOpen,
    handleDelete,
    // sortField,
    // sortOrder,
    // handleSortChange,
    // availableSizesFilter,
    // setAvailableSizesFilter,
    isLoading,
    currentPage,
    totalPages,
    totalProducts,
    handlePageChange
  } = useData()

  const [requestStatus, setRequestStatus] = useState<string | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  // const [isCheckModalOpen, setIsCheckModalOpen] = useState(false)
  // const [scrapingStatus, setScrapingStatus] = useState<any>(null)
  const [scrapeUrl, setScrapeUrl] = useState<string>('')
  const [urlError, setUrlError] = useState<string>('')

  // const sortOptions = [
  //   { value: 'name', label: 'За назвою' },
  //   { value: 'salePercent', label: 'За знижкою' },
  //   { value: 'date', label: 'За датою' },
  //   { value: 'priceRegular', label: 'За ціною' }
  // ]

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('URL не може бути порожнім')
      return false
    }

    try {
      const urlObj = new URL(url)
      if (!urlObj.hostname.includes('smyk.com')) {
        setUrlError('URL повинен бути з домену smyk.com')
        return false
      }
      setUrlError('')
      return true
    } catch {
      setUrlError('Невірний формат URL')
      return false
    }
  }

  const requestScraping = () => {
    if (!validateUrl(scrapeUrl)) {
      return
    }
    setIsRequestModalOpen(false)
    fetch(`${cartersUrl}/smyk/run-scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: scrapeUrl,
        onlychecking: false
      })
    })
      .then((response) => {
        if (response.status === 200) {
          setRequestStatus('success')
          console.log(response.status)
        } else {
          console.log('Unexpected status code:', response.status)
        }
      })
      .catch((error) => {
        throw new Error(`There was an error starting scraping: ${error}`)
      })
  }

  // const checkScraping = () => {
  //   fetch(`${cartersUrl}/smyk/run-scraper`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       url: scrapeUrl,
  //       onlychecking: true
  //     })
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`)
  //       }
  //       return response.json()
  //     })
  //     .then((data) => {
  //       setIsCheckModalOpen(true)
  //       setScrapingStatus(data)
  //     })
  //     .catch((error) => {
  //       console.error(`There was an error starting scraping: ${error}`)
  //     })
  // }

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
            label='Фільтр по кількості'
            value={availableSizesFilter}
            onChange={(e) => setAvailableSizesFilter(parseInt(e.target.value))}
            style={{ margin: '10px', minWidth: '140px' }}
          >
            <MenuItem value={0}>Будь-яка кількість</MenuItem>
            <MenuItem value={2}>{'>= 2'}</MenuItem>
            <MenuItem value={3}>{'>= 3'}</MenuItem>
            <MenuItem value={4}>{'>= 4'}</MenuItem>
            <MenuItem value={5}>{'>= 5'}</MenuItem>
          </TextField>

          <TextField
            select
            label='Сортувати за'
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{ margin: '10px', minWidth: '140px' }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}{' '}
                {sortField === option.value && (sortOrder === 1 ? '↑' : '↓')}
              </MenuItem>
            ))}
          </TextField> */}

          <Button
            variant='contained'
            sx={{ marginRight: '20px' }}
            onClick={() => setIsConfirmDeleteModalOpen(true)}
          >
            Видалити товари
          </Button>
          <Button
            variant='contained'
            sx={{ marginRight: '20px' }}
            onClick={() => setIsRequestModalOpen(true)}
          >
            Запустити парсер
          </Button>
          {/* <Button
            variant='contained'
            sx={{ marginRight: '20px' }}
            onClick={() => checkScraping()}
          >
            Перевірити статус парсера
          </Button> */}
        </Box>

        <Typography gutterBottom variant='h5' color={'black'}>
          Кількість товарів: {totalProducts}
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
            {products.map((product) => (
              <ProductCard
                type='smyk'
                key={product.articleCode}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
            paddingBottom: '40px'
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant='outlined'
            color='primary'
          />
        </Box>
      </Container>

      <Alert
        title='Ви впевнені що хочете видалити всі товари?'
        content='Будуть видалені всі товари Smyk. Після видалення товари не можливо буде відновити!'
        cancelText='Скасувати'
        confirmText='Підтвердити'
        isOpen={isConfirmDeleteModalOpen}
        onCancel={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {/* {scrapingStatus && (
        <Alert
          title='Статус парсера'
          content={
            <div>
              <p>
                Парсер запущено:{' '}
                {scrapingStatus.is_scraper_running ? 'Так' : 'Ні'}
              </p>
              <p>Прогрес: {scrapingStatus.progres}</p>
            </div>
          }
          confirmText='Закрити'
          isOpen={isCheckModalOpen}
          onCancel={() => setIsCheckModalOpen(false)}
          onConfirm={() => setIsCheckModalOpen(false)}
        />
      )} */}

      <Alert
        title='Оберіть категорію товарів для запуску парсера'
        content={
          <div>
            <p>Введіть URL для парсингу:</p>
            <TextField
              fullWidth
              value={scrapeUrl}
              onChange={(e) => {
                setScrapeUrl(e.target.value)
                validateUrl(e.target.value)
              }}
              margin='normal'
              placeholder='https://www.smyk.com/wyprzedaz/...'
              error={!!urlError}
              helperText={urlError}
            />
          </div>
        }
        cancelText='Скасувати'
        confirmText='Підтвердити'
        isOpen={isRequestModalOpen}
        onCancel={() => setIsRequestModalOpen(false)}
        onConfirm={requestScraping}
      />

      <Alert
        title={
          requestStatus === 'success'
            ? 'Парсер запущено'
            : 'Помилка запуску парсера'
        }
        content={
          requestStatus === 'success'
            ? 'Оновіть сторінку через 5-10 хвилин'
            : 'Не вдалося запустити парсер. Перевірте URL та спробуйте ще раз.'
        }
        confirmText='Зрозуміло'
        isOpen={requestStatus !== null}
        onCancel={() => setRequestStatus(null)}
        onConfirm={() => setRequestStatus(null)}
      />
    </>
  )
}

export default Smyk
