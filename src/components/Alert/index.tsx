import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material'

interface AlertProps {
  setScrapeType?: (type: string) => void
  types?: string[]
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
  content: string | JSX.Element
  cancelText?: string
  confirmText?: string
}

const Alert = ({
  setScrapeType,
  types,
  title,
  content,
  cancelText,
  confirmText,
  isOpen,
  onCancel,
  onConfirm
}: AlertProps) => {
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = (event.target as HTMLInputElement).value
    setScrapeType && setScrapeType(newType)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {content}
        </DialogContentText>
        {types && (
          <FormControl>
            <FormLabel id='demo-row-radio-buttons-group-label'>
              Категорія
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby='demo-row-radio-buttons-group-label'
              name='row-radio-buttons-group'
              onChange={handleTypeChange}
            >
              {types.map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
                  label={type}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        {cancelText && <Button onClick={onCancel}>{cancelText}</Button>}
        <Button onClick={onConfirm} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Alert
