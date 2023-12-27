import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


interface AlertProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    cancelText?: string;
    confirmText: string;
}

const Alert = ({ title, content, cancelText, confirmText, isOpen, onCancel, onConfirm }: AlertProps) => {
    return (<Dialog
        open={isOpen}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {content}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {cancelText && <Button onClick={onCancel}>{cancelText}</Button>
            }
            <Button onClick={onConfirm} autoFocus>
                {confirmText}
            </Button>
        </DialogActions>
    </Dialog>)

};

export default Alert;
