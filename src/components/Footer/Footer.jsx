import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './Title.css'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer style ={{display: 'flex', marginBottom: '20px', gap: '6vh', justifyContent: 'center'}}>
            <a style={{justifyContent: 'center', color: 'darkgray'}}rel="noreferrer" href="/about" onClick={() => navigate('/about')}>
                About
            </a>
            <a style={{justifyContent: 'center', color: 'darkgray'}} href='https://forms.gle/o4oxGsqGaBUqaWqi8' target='_blank'  rel="noreferrer">
                Feedback form
            </a>
        </footer>
    )
}

export default Footer;