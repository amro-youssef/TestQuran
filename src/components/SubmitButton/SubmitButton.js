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
        >
            {loading ? <CircularProgress width={32}/> : "Randomize"}
        </Button>
    )
}

export default SubmitButton;