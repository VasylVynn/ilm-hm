import { styled } from "@mui/system";
import Card from "@mui/material/Card";

export const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '23%',
    },
    margin: '10px',
    position: 'relative',
    '& .sale-chip': {
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: 'red',
        height: '24px',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
        zIndex: 5,
        '& .MuiChip-label': {
            padding: '0 5px',
        }
    },
    '& .category-chip': {
        display: 'flex',
        alignItems: 'center',
        gap:'5px',
        borderRadius: '8px',
        padding: '2px 5px',
        position: 'absolute',
        bottom: 5,
        left: 5,
        backgroundColor: '#5b76ff',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
        textTransform: 'capitalize',
        fontSize: '14px',
    },
    '& .MuiIconButton-root': {
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 5,
    },
    '& .MuiCardContent-root': {
        height: 'calc(100% - 220px)',
        display: 'flex',
        flexDirection: 'column',
    },
    '& .sizesContainer': {
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
    },
    '& .bottomBox': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
}));