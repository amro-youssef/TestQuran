import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';


const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main,
            backgroundColor: theme.palette.mode === 'dark' ? '#e7e9eae7' : theme.palette.primary.main,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: theme.shadows[4],
            transition: 'background-color 0.3s, color 0.3s',
          }}
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;