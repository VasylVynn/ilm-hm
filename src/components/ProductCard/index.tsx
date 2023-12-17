import { Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Divider, IconButton, Box } from '@mui/material';
import { Product } from '../../pages/Dashboard/useData';
import CloseIcon from '@mui/icons-material/Close'; // Import Close Icon

import FlagIcon from '../FlagIcon';

interface ProductCardProps {
    product: Product;
    onDelete: (articleCode: string) => void; // Type for delete function
}

export const ProductCard = ({ product, onDelete }: ProductCardProps) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const cardStyle = {
        width: isSmallScreen ? '100%' : '23%', // 100% width on small screens, 23% otherwise
        margin: '10px',
    };

    const renderSizes = () => {
        return JSON.parse(product.availableSizes).map((size: string) => {
            const isFewLeft = size.includes("Few pieces left");
            const displaySize = isFewLeft ? size.replace("Few pieces left", "").trim() : size;
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
        } else {
            translatedReason = 'Новий товар';
        }

        return (
            <Typography variant="body2" color="text.secondary">
                {translatedReason}
            </Typography>
        );
    };


    const handleDelete = () => {
        onDelete(product.articleCode);
    };

    return (
        <Card style={cardStyle} sx={{ position: 'relative' }}>
            <IconButton onClick={handleDelete} style={{ position: 'absolute', right: 0, top: 0 }}>
                <CloseIcon />
            </IconButton>
            <a href={product.link} target='_blank'>

                <CardMedia
                    component="img"
                    height="220"
                    image={product.imageLink}
                    alt={product.articleCode}
                />
                <CardContent>
                    {product.name && <Typography variant="body2" color="text.secondary">
                        {product.name}
                    </Typography>}
                    <Typography variant="body2" color="text.secondary">
                        Код: {product.articleCode}
                    </Typography>
                    <Divider style={{ margin: '5px 0' }} />
                    <Typography variant="body2" color="text.secondary">
                        Знижка: {product.salePercent}
                    </Typography>
                    <Divider style={{ margin: '5px 0' }} />
                    <Typography variant="body2" color="text.secondary">
                        Ціна з знижкою: {product.priceSale} <br /> (Ціна без знижки: {product.priceRegular})
                    </Typography>
                    <Divider style={{ margin: '5px 0' }} />
                    <Typography variant="body2" color="text.secondary">
                        Доступні розміри:
                    </Typography>
                    <div>
                        {renderSizes()}
                    </div>
                    {renderReason()}
                    <Divider style={{ margin: '5px 0' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {<Typography variant="body2" color="text.secondary">
                            Категорія: {product.category}
                        </Typography>}
                        <FlagIcon isoCode={product.region} />
                    </Box>

                </CardContent>
            </a>

        </Card>
    );
};

export default ProductCard;
