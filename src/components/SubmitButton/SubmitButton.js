import { Button } from '@mui/material';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const SubmitButton = ( {onClick, loading} ) => {

    return (
        
        <Button
            size="medium"
            variant="contained"
            onClick={onClick}
        >
            {loading ? <CircularProgress width={32}/> : "Randomise"}
        </Button>
    )
}

export default SubmitButton;