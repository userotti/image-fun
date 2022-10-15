import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'


export default function App() {

  const [pageSize, ] = useState(12)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingImages, setLoadingImages] = useState(false)

  useEffect(()=>{

    console.log("searchTerm: ", searchTerm)
    let API_KEY = '30547207-fa77989eab6e92806d2cdcb24';
    let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&page=${currentPage}&per_page=${pageSize}`;
    console.log("loadingImages: ", loadingImages)
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
              total: body.total
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
    console.log("results:" , results);
    return results && results[searchText] && results[searchText][currentPage] ? results[searchText][currentPage] : null
  }, [results]);
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{
          p: 2,
          backgroundColor: '#fafafa',
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
          <FormControl size={'small'} sx={{ m: 1, width: '25ch', backgroundColor: '#fff', }} variant="outlined">
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
      <Container maxWidth="sm" sx={{
          p: 2,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
          {results[searchTerm] ? `Showing ${results[searchTerm][currentPage].length} of ${results[searchTerm].total} results for ${searchTerm}` : null}
      </Container>    
      <Container maxWidth="lg" sx={{
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          { 
            displayResults ? <ImageList cols={4} >
                { 
                  displayResults.map((hit)=>{
                    return <ImageListItem key={hit.id}>
                      <img
                        src={`${hit.webformatURL}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${hit.webformatURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={hit.title}
                        loading="lazy"
                      />
                    </ImageListItem>
                  })
                } 
            </ImageList> : <p> {loadingImages && `Searching for ${searchTerm}`} </p>
          }  
      </Container>
    </React.Fragment>
  );
}
