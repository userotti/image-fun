import useMediaQuery from '@mui/material/useMediaQuery';
import Masonry from '@mui/lab/Masonry';

import ImageCard from './ImageCard';
//Component to render the images
const ImageList = ({hits, onHitClick}) => {
  const smallScreen = useMediaQuery('(max-width:800px)');
  const tinyScreen = useMediaQuery('(max-width:500px)');
  return <Masonry columns={tinyScreen ? 1 : smallScreen ? 2 : 4}> 
    { 
      hits.map((hit)=>{
        return <ImageCard hit={hit} key={hit.id} onClick={onHitClick}/>
      })
    } 
  </Masonry>
}

export default ImageList