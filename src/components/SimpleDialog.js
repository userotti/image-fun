import useMediaQuery from '@mui/material/useMediaQuery';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const SimpleDialog = (props) => {
  const { onClose, open, user, src} = props;

  const handleClose = () => {
    onClose();
  };

  const smallScreen = useMediaQuery('(max-width:800px)');
  const tinyScreen = useMediaQuery('(max-width:500px)');

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>By {user}</DialogTitle>
      
      <img src={src} alt={user}></img>
      
    </Dialog>
  );
}

export default SimpleDialog