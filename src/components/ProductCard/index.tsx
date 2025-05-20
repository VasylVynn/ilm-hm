import {
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Box,
  Chip
} from '@mui/material'
import { Product } from '../../pages/Dashboard/useData'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

import { StyledCard } from './styles'
import Flag from 'react-world-flags'

interface ProductCardProps {
  product: Product
  type?: string
}

export const ProductCard = ({ product, type = 'h&m' }: ProductCardProps) => {
  const renderSizes = () => {
    let sizes: string[] = []
    const currentSizes = product.availableSizes
    try {
      const availableSizes =
        typeof currentSizes === 'string'
          ? currentSizes.replace(/'/g, '"')
          : currentSizes
      sizes =
        typeof availableSizes === 'string'
          ? JSON.parse(availableSizes)
          : availableSizes
    } catch (error) {
      console.error('Error parsing availableSizes:', error)
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return (
        <Typography variant='body2' component='span' color='text.secondary'>
          One size
        </Typography>
      )
    }

    return sizes.map((size: string) => {
      const isFewLeft =
        size.includes('(Few pieces left)') ||
        size.includes('Zostało tylko kilka sztuk!')
      const displaySize = isFewLeft
        ? size
            .replace('(Few pieces left)', '')
            .replace('Zostało tylko kilka sztuk!', '')
            .trim()
        : size
      return (
        <Typography
          key={size}
          variant='body2'
          component='span'
          color={isFewLeft ? 'red' : 'text.secondary'}
        >
          {`${displaySize},`}
        </Typography>
      )
    })
  }

  const renderReason = () => {
    let translatedReason
    if (product.reason === 'isUpdated') {
      translatedReason = 'Змінилась ціна'
    } else if (product.reason === 'isNew') {
      translatedReason = 'Новий товар'
    } else {
      translatedReason = 'Додано вручну'
    }

    return (
      <Typography variant='body2' color='text.secondary'>
        {translatedReason} {''}
        {format(new Date(product.date), 'dd MMMM HH:mm', { locale: uk })}
      </Typography>
    )
  }

  const imageUrl =
    type === 'h&m'
      ? product.imageLink[0]
      : type === 'carters'
      ? product.imageLink + '?sw=320'
      : product.imageLink

  return (
    <StyledCard>
      {product.salePercent && (
        <Chip
          className='sale-chip'
          label={
            type === 'carters'
              ? '-' + product.salePercent + '%'
              : product.salePercent
          }
          color='default'
          variant='outlined'
        />
      )}
      <a href={product.link} target='_blank'>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component='img'
            height='220'
            image={imageUrl}
            alt={product?.articleCode || ''}
          />
          {product.salePercent && (
            <Box className='category-chip'>
              {product.category}
              <Flag
                code={type === 'carters' ? 'US' : product.region}
                height='24'
                width='28'
              />
            </Box>
          )}
        </Box>
        <CardContent>
          {product.name && (
            <Typography variant='body2' color='text.secondary'>
              {product.name}
            </Typography>
          )}
          <Typography variant='body2' color='text.secondary'>
            Код: {product?.articleCode || ''}
          </Typography>
          <Divider style={{ margin: '5px 0' }} />
          <Typography variant='body2' color='text.secondary'>
            {product.priceSale && (
              <>
                Ціна з знижкою:{' '}
                <b>
                  {type === 'carters'
                    ? '$' + product.priceSale
                    : product.priceSale}
                  {type === 'cA' && ' PLN'}
                </b>
              </>
            )}
            {product.priceSale && <br />}
            {`Ціна ${product.priceSale ? 'без знижки' : ''}: `}
            <b>
              {type === 'carters'
                ? '$' + product.priceRegular
                : product.priceRegular}
              {type === 'cA' && ' PLN'}
            </b>
          </Typography>
          <Divider style={{ margin: '5px 0' }} />
          <Typography variant='body2' color='text.secondary'>
            Доступні розміри:
          </Typography>
          <div>{renderSizes()}</div>
          <Divider style={{ margin: '5px 0' }} />
          {renderReason()}
        </CardContent>
      </a>
    </StyledCard>
  )
}

export default ProductCard
