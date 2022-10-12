import * as React from 'react';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

export default function App() {

  const [searchText, setSearchText] = useState('')

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{
          p: 2,
          backgroundColor: '#fafafa',
        }}>
        <form 
          onSubmit={(event)=>{
            event.preventDefault()
            console.log("emlk")
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
      <Container maxWidth="lg" sx={{
          p: 2,
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        
      </Container>
    </React.Fragment>
  );
}
