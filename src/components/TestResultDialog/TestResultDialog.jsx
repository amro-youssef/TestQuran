import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Accordion,
  AccordionActions,
  FormControl,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Verse from '../Verse/Verse.jsx';

const TestResultDialog = ({
  open,
  handleClose,
  correctAnswers,
  incorrectAnswers,
  timeTaken,
  restart
}) => {
  const totalQuestions = correctAnswers.length + incorrectAnswers.length;
const theme = useTheme();


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Test Results</DialogTitle>
      <DialogContent>
        <FormControl>
            <Typography variant="h6" gutterBottom>
            You scored {correctAnswers.length} out of {totalQuestions}
            </Typography>
            <Typography variant="body1" gutterBottom>
            Time taken: {timeTaken}
            </Typography>
        </FormControl>
        <Typography variant="subtitle1" gutterBottom>
          Correct Answers:
        </Typography>
        <List dense>
            
          {correctAnswers.length > 0 && correctAnswers.map((answer, index) => (
            <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
                <DoneIcon color="success" />
                <div style={{marginRight: "8px"}}></div>Question {answer.questionNumber}
            </AccordionSummary>
            <AccordionDetails>
                {/* <Verse verseText={answer.verses[0]}></Verse> */}
                {answer.verses.map((verse, verseIndex) => (
                  <>
                    <ListItem key={verseIndex}>
                    <ListItemIcon>
                       {/* <DoneIcon color="success" /> */}
                       {answer.chapterNumber}:{answer.firstVerseNumber + verseIndex}
                    </ListItemIcon>
                    <ListItemText 
                        dir="rtl" 
                        primary={(verse ? <Verse verseText={verse} className='resultDialog'></Verse> : <></>)} 
                        style={{
                            textAlign: 'right',
                            // paddingRight: theme.spacing(10),
                        }}
                    />
                  </ListItem>
                  {verseIndex !== answer.verses.length - 1 && <Divider />}
                  </>
                ))}
            </AccordionDetails>
          </Accordion>
          ))}
        </List>
        {incorrectAnswers.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Incorrect Answers:
            </Typography>
            
            <List dense>
              {incorrectAnswers.map((answer, index) => (
                <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                    <CloseIcon color="error" />
                    <div style={{marginRight: "8px"}}></div>Question {answer.questionNumber}
                </AccordionSummary>
                <AccordionDetails>
                    {/* <Verse verseText={answer.verses[0]}></Verse> */}
                    {answer.verses.map((verse, verseIndex) => (
                      <>
                        <ListItem key={index}>
                        <ListItemIcon>
                          {/* <DoneIcon color="success" /> */}
                          {answer.chapterNumber}:{answer.firstVerseNumber + verseIndex}
                        </ListItemIcon>
                        <ListItemText 
                            dir="rtl" 
                            primary={(verse ? <Verse verseText={verse} style={{class: 'resultDialog'}}></Verse> : <></>)} 
                            style={{
                                textAlign: 'right',
                                paddingRight: theme.spacing(2),
                            }}
                        />
                      </ListItem>
                        {verseIndex !== answer.verses.length - 1 && <Divider />}
                      </>
                      
                    ))}
                </AccordionDetails>
              </Accordion>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={restart} color="primary">
          Restart
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestResultDialog;