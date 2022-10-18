import * as React from 'react';
import './App.css'
import { useState, useMemo, useCallback, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Masonry from '@mui/lab/Masonry';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Pagination, Avatar} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import useImageLoaded from './hooks/ImageLoaded';
import CircularProgress from '@mui/material/CircularProgress';

const THEME = createTheme({
  typography: {
   "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
   "fontSize": 14,
   "fontWeightLight": 300,
   "fontWeightRegular": 400,
   "fontWeightMedium": 500
  }
});

//Single card elemnt
const ImageCard = ({hit}) => {
  const [ref, loaded, onLoad] = useImageLoaded()
  const skeletonWrapperRef = useRef()

  const ratio = useMemo(()=>{
    return hit.imageHeight / hit.imageWidth
  }, [hit])
  
  return <>
    { 
      loaded ? <Card>
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
      </Card> : <div ref={skeletonWrapperRef} >
        <Stack>
            <Skeleton variant="rectangular" animation="wave" sx={{height: '0px', paddingTop: `${(ratio * 100)}%`,  borderRadius: '16px'}} />
            <div>

            </div>
            <Stack>
              <Skeleton variant="text" animation="wave" sx={{ fontSize: '28px', marginTop: '4px' }} />
              <Skeleton variant="text" animation="wave" sx={{ fontSize: '22px', marginTop: '4px' }} />
            </Stack>
            <img ref={ref} onLoad={onLoad} src={hit.webformatURL} className='cardImageGhost' alt={hit.id}/>
        </Stack>
      </div>
    }
  </>

}
//Component to render the images
const ImageList = ({hits}) => {

  const smallScreen = useMediaQuery('(max-width:800px)');
  const tinyScreen = useMediaQuery('(max-width:500px)');

  return <Masonry columns={tinyScreen ? 1 : smallScreen ? 2 : 4}> 
    { 
      hits.map((hit)=>{
        return <ImageCard hit={hit} key={hit.id}/>
      })
    } 
  </Masonry>
}

export default function App() {

  const [pageSize, ] = useState(12)
  const [searchTerm, setSearchTerm] = useState('flowers')
  const [searchText, setSearchText] = useState('flowers')
  const [results, setResults] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingImages, setLoadingImages] = useState(false)

  //The main call back for fetching new images
  const fetchResults = useCallback((searchTerm, currentPage, pageSize)=>{

    let API_KEY = '30547207-fa77989eab6e92806d2cdcb24';
    let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&page=${currentPage}&per_page=${pageSize}`;
    
    setCurrentPage(currentPage)
    setSearchTerm(searchTerm)
    setLoadingImages(true)
    
    fetch(URL).then((response)=>{
      response.json().then((body)=>{
        setResults({
          ...results,
          [searchTerm]: {
            ...results[searchTerm],
            [currentPage]: body.hits,
            totalHits: body.totalHits
          }
        })
      }).catch((e)=>{
        console.log("Something went wrong: ", e.message)
      }).finally(()=>{
        //Show the loading state
        setLoadingImages(false)
      })
    })

  }, [results])

  //Useful values needed during rendering that could be undefined
  const {
    currentPageResults,
    searchTermResults
  } = useMemo(()=>{
    return {
      currentPageResults: results && results[searchTerm] && results[searchTerm][currentPage] ? results[searchTerm][currentPage] : null,
      searchTermResults: results && results[searchTerm] ? results[searchTerm] : null,
    }
  }, [results, currentPage, searchTerm]);

  return (
    <ThemeProvider theme={THEME}>
      <React.Fragment>
        <CssBaseline />

        {/*Small from at the top of the screen*/} 
        <Container maxWidth="lg" sx={{
            p: 2,
            backgroundColor: '#f4f4f4'
          }}>
          <form 
            onSubmit={(event)=>{
              event.preventDefault();
              fetchResults(searchText, 1, pageSize)
            }}
            className='formContainer'
          >
            <FormControl size={'small'} sx={{ m: 1, width: '25ch', backgroundColor: '#fafafa', }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-search">Search for images...</InputLabel>
              <OutlinedInput
                id="outlined-adornment-search"
                value={searchText}
                onChange={(event)=>{
                  setSearchText(event.target.value)
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                label="Search for images..."
              />
            </FormControl>
            <Button type="submit" variant="contained" size="medium">Go</Button>
          </form>
        </Container>

        {/*Results feedback and pagnigation container*/}  
        <Container maxWidth="lg" sx={{ 
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '50px',
            backgroundColor: '#f4f4f4'
        }}>
          { (searchTermResults && currentPageResults)  ? 
            <Typography variant="subtitle1" gutterBottom>
              {`Showing ${pageSize * (currentPage-1)}...${pageSize * (currentPage-1) + currentPageResults.length} of ${searchTermResults.totalHits} results for "${searchTerm}"`} 
            </Typography>  : <div/>}
            
            {searchTermResults && <Pagination count={(Math.floor(searchTermResults.totalHits / pageSize) + 1)} page={currentPage} onChange={(e, page)=>{
              fetchResults(searchTerm, page, pageSize)
            }}/>}
        </Container>    

        {/*Image Card container*/}    
        <Container maxWidth="lg" sx={{ 
            p: 2,
            backgroundColor: '#f4f4f4',
            overflow: 'hidden'
        }}>
            { currentPageResults ? <ImageList hits={currentPageResults}/> : <div className='emptyResults'>
                {loadingImages ? <CircularProgress/> : <Typography variant="h4" gutterBottom>
                  Search for the images in the Pixabay database!
                </Typography>}
              </div>
            }
        </Container>
      </React.Fragment>  
    </ThemeProvider>
    
  );
}
