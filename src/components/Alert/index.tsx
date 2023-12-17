import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


interface AlertProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const Alert = ({ isOpen, onCancel, onConfirm }: AlertProps) => {
    return (<Dialog
        open={isOpen}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {"Ви впевнені що хочете видалити всі товари?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Будуть виладені всі товари які зараз відфільтровані,
                або всі товари якщо фільтри не обрано.
                Після видалення товари не можливо буде відновити!
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Скасувати</Button>
            <Button onClick={onConfirm} autoFocus>
                Підтвердити
            </Button>
        </DialogActions>
    </Dialog>)

};

export default Alert;
