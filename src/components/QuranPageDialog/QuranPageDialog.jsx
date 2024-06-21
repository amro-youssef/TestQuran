import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import {getV1PageNumber} from '../../backend.js';

/**
 * Shows an image of the page which contains the verse inputted
 */
const QuranPageDialog = ({ open, onClose, chapterNumber, verseNumber }) => {
    const [imageUrl, setImageUrl] = useState('');
    const isMobile = useMediaQuery('(max-width:500px)');

    useEffect(() => {
        // Fetch the image URL for the given chapter and verse number
        // Replace this with your actual logic to fetch the image URL
        const fetchImageUrl = async () => {
            if (!chapterNumber || !verseNumber) {
                return;
            }
            const pageNumber = await getV1PageNumber(chapterNumber, verseNumber);
            const url = `/quran_pages/page_${pageNumber}.png`;
            setImageUrl(url);

        };

        fetchImageUrl();
    }, [chapterNumber, verseNumber]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="" >
            <DialogContent>
                {imageUrl && <img src={imageUrl} alt="Quran Page" style={{ maxWidth: '100%', width: 'auto', height: isMobile ? '450px' : '550px' }} />}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>

    );
};

export default QuranPageDialog;