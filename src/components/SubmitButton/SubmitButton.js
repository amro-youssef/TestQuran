import { Button } from '@mui/material';
import React from 'react';

const SubmitButton = ( {onClick} ) => {

    return (
        <Button
            size="large"
            variant="contained"
            onClick={onClick}
        >
            Randomise
        </Button>
    )
}

export default SubmitButton;