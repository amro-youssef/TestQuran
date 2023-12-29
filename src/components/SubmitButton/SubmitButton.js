import { Button } from '@mui/material';
import React from 'react';

const SubmitButton = ( {onClick} ) => {

    return (
        <Button
            size="medium"
            variant="contained"
            onClick={onClick}
        >
            Randomise
        </Button>
    )
}

export default SubmitButton;