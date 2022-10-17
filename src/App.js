import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ImageListItem from '@mui/material/ImageListItem'
import { Pagination, ImageListItemBar, Avatar } from '@mui/material';

import {ThemeProvider, createTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



const THEME = createTheme({
  typography: {
   "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
   "fontSize": 14,
   "fontWeightLight": 300,
   "fontWeightRegular": 400,
   "fontWeightMedium": 500
  }
});

export default function App() {


  const [pageSize, ] = useState(12)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingImages, setLoadingImages] = useState(false)

  useEffect(()=>{

    let API_KEY = '30547207-fa77989eab6e92806d2cdcb24';
    let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&page=${currentPage}&per_page=${pageSize}`;
    
    if (!loadingImages) {
      setLoadingImages(true)
      fetch(URL).then((response)=>{
        response.json().then((body)=>{
          console.log("body: ", body)
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
          setLoadingImages(false)
        })
      })
    }
  }, [searchTerm, currentPage])

  const displayResults = useMemo(()=>{
    return results && results[searchText] && results[searchText][currentPage] ? results[searchText][currentPage] : null
  }, [results]);
  
  return (
    <ThemeProvider theme={THEME}>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg" sx={{
            p: 2,
          }}>
          <form 
            onSubmit={(event)=>{
              event.preventDefault();
              setSearchTerm(searchText);
            }}
            style={{  
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'}}
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
        <Container maxWidth="lg" sx={{ 
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '50px',
        }}>
          { results[searchTerm] ? 
            <Typography variant="subtitle1" gutterBottom>
              {`Showing ${results[searchTerm][currentPage].length} of ${results[searchTerm].totalHits} results for "${searchTerm}"`} 
            </Typography>  : <div/>}
          <Pagination/>  
        </Container>    
        
        <Container maxWidth="lg" sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            { 
              displayResults ? displayResults.map((hit)=>{
                return <Card key={hit.id}>
                  <CardMedia
                    component="img"
                    height="194"
                    image={hit.imageURL}
                  />
                </Card>
              }) : null
            }  
        </Container>
      </React.Fragment>  
    </ThemeProvider>
    
  );
}
