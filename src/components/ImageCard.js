import { useMemo } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { Avatar} from '@mui/material';
import Typography from '@mui/material/Typography';

import useImageLoaded from '../hooks/ImageLoaded'

//Single card elemnt
const ImageCard = ({hit, onClick}) => {
  const [ref, loaded, onLoad] = useImageLoaded()
  
  const ratio = useMemo(()=>{
    return hit.imageHeight / hit.imageWidth
  }, [hit])
  
  return <div>
    { 
      loaded ? <Card sx={{cursor: 'pointer'}} onClick={()=>{
        onClick(hit)
      }} className='fadeInContainer'>
        <img src={hit.webformatURL} className='cardImage' alt={hit.id}/>
        <div className='cardBody'>
          <div>
            <Typography variant="subtitle1" gutterBottom>
              {`By ${hit.user}`}
            </Typography>
            <Typography variant="caption" gutterBottom>
              {hit.tags}
            </Typography>
          </div>
          <Avatar src={hit.userImageURL}/>
        </div>
      </Card> : <div className='fadeInContainer'>
        <Stack>
            <Skeleton variant="rectangular" animation="wave" sx={{opacity: '0.4', height: '0px', paddingTop: `${(ratio * 100)}%`,  borderRadius: '16px'}} />
            <div>

            </div>
            <Stack>
              <Skeleton variant="text" animation="wave" sx={{ fontSize: '26px', marginTop: '4px' }} />
              <Skeleton variant="text" animation="wave" sx={{ fontSize: '22px', marginTop: '4px' }} />
            </Stack>
            <img ref={ref} onLoad={onLoad} src={hit.webformatURL} className='cardImageGhost' alt={hit.id}/>
        </Stack>
      </div>
    }
  </div>

}

export default ImageCard