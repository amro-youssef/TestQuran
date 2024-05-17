import React from 'react';
// import './Title.css'

const Footer = () => {
    return (
        <footer style ={{display: 'flex', marginBottom: '20px', gap: '6vh', justifyContent: 'center'}}>
            <a style={{justifyContent: 'center', color: 'darkgray'}} target='_blank' rel="noreferrer" href="https://api-docs.quran.com/docs/category/quran.com-api">
                Quran.com api
            </a>
            <a style={{justifyContent: 'center', color: 'darkgray'}} href='https://forms.gle/o4oxGsqGaBUqaWqi8' target='_blank'  rel="noreferrer">
                Feedback form
            </a>
        </footer>
    )
}

export default Footer;