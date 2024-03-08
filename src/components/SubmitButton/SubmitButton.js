import { Button } from '@mui/material';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const SubmitButton = ( {onClick, loading} ) => {

    return (
        
        <Button
            size="medium"
            variant="contained"
            onClick={onClick}
            disabled={loading}
            sx={{width: '120px', height: '48px', // Set the desired height
            minHeight: '48px',}}
        >
            {loading ? <CircularProgress width={32}/> : "Randomize"}
        </Button>
    )
}

export default SubmitButton;