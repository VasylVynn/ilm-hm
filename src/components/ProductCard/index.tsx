import { CardMedia, CardContent, Typography, Divider, IconButton, Box, Chip } from '@mui/material';
import { Product } from '../../pages/Dashboard/useData';
import CloseIcon from '@mui/icons-material/Close'; // Import Close Icon
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import { StyledCard } from './styles';
import Flag from 'react-world-flags';


interface ProductCardProps {
    product: Product;
    onDelete: (articleCode: string) => void; // Type for delete function
    type?: string;
}

export const ProductCard = ({ product, onDelete, type = 'h&m' }: ProductCardProps) => {

    const cAUrl = 'https://www.c-and-a.com/img/product/q_auto:good,b_rgb:FAFAFA,c_scale,w_262/';

    const renderSizes = () => {
        const sizes = JSON.parse(product.availableSizes);
        if (sizes.length === 0) {
            return (
                <Typography variant="body2" component="span" color="text.secondary">
                    One size
                </Typography>
            );
        }
        return sizes.map((size: string) => {
            const isFewLeft = size.includes("Few pieces left") || size.includes("Zostało tylko kilka sztuk!");
            const displaySize = isFewLeft ? size.replace("Few pieces left", "").replace("Zostało tylko kilka sztuk!", "").trim() : size;
            return (
                <Typography key={size} variant="body2" component="span" color={isFewLeft ? "red" : "text.secondary"}>
                    {`${displaySize},`}
                </Typography >
            );
        });
    };

    const renderReason = () => {
        let translatedReason;
        if (product.reason === 'isUpdated') {
            translatedReason = 'Змінилась ціна';
        } else if (product.reason === 'isNew') {
            translatedReason = 'Новий товар';
        } else {
            translatedReason = 'Додано вручну';
        }

        return (
            <Typography variant="body2" color="text.secondary">
                {translatedReason} {''}
                {format(new Date(product.date), 'dd MMMM HH:mm', { locale: uk })}
            </Typography>
        );
    };


    const handleDelete = () => {
        onDelete(product.articleCode);
    };

    return (
        <StyledCard >
            {product.salePercent && <Chip className='sale-chip' label={product.salePercent} color='default' variant="outlined" />}
            <IconButton onClick={handleDelete}>
                <CloseIcon />
            </IconButton>
            <a href={type === 'h&m' ? product.link : 'https://www.c-and-a.com' + product.link} target='_blank'>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="220"
                        image={type === 'h&m' ? product.imageLink : cAUrl + product.imageLink}
                        alt={product.articleCode}
                    />
                    {product.salePercent && <Box className='category-chip'  >
                        {product.category}
                        <Flag code={product.region} height="24" width='28' />
                    </Box>}
                </Box>
                <CardContent >
                    {product.name && <Typography variant="body2" color="text.secondary">
                        {product.name}
                    </Typography>}
                    <Typography variant="body2" color="text.secondary">
                        Код: {product.articleCode}
                    </Typography>
                    <Divider style={{ margin: '5px 0' }} />
                    <Typography variant="body2" color="text.secondary">
                        {product.priceSale && <>Ціна з знижкою: <b>{product.priceSale}</b></>}
                        {product.priceSale && <br />}
                        {`Ціна ${product.priceSale ? 'без знижки' : ''}: `}<b>{product.priceRegular}</b>
                    </Typography>
                    <Divider style={{ margin: '5px 0' }} />
                    <Typography variant="body2" color="text.secondary">
                        Доступні розміри:
                    </Typography>
                    <div >
                        {renderSizes()}
                    </div>
                    <Divider style={{ margin: '5px 0' }} />
                    {renderReason()}
                </CardContent>
            </a>

        </StyledCard >
    );
};

export default ProductCard;
