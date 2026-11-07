import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import SelectionEditor from '../../components/VerseSelector/SelectionEditor.jsx';
import SetsBar, { ClearButton, SaveSetButton } from '../../components/VerseSelector/SetsBar.jsx';
import { encodeSelection, selectionVerses, withIds, withoutIds, WHOLE_QURAN } from '../../components/VerseSelector/selection.js';
import { useSetsStore } from '../../store/useSetsStore.js';
import '../../components/VerseSelector/VerseSelector.css';
import './TestDialog.css';

const DEFAULT_QUESTIONS = 5;

// pinnedSet: a set that belongs to the page (e.g. a class's set), offered first and used as the starting selection
const TestDialog = ({ open, closeDialog, pinnedSet }) => {
  const navigate = useNavigate();
  const fullScreen = useMediaQuery('(max-width:600px)');
  const { recentTests, addRecentTest } = useSetsStore();
  const [items, setItems] = useState([]);
  const [numQuestions, setNumQuestions] = useState(DEFAULT_QUESTIONS);
  const verseCount = useMemo(() => selectionVerses(items).length, [items]);

  // start from the page's set, else the whole Quran; previous tests are a tap away in the chips above
  useEffect(() => {
    if (!open) return;
    setItems(withIds(pinnedSet?.items ?? WHOLE_QURAN));
    setNumQuestions(DEFAULT_QUESTIONS);
  }, [open]);

  // recent tests and sets saved from here also bring back their number of questions
  const pick = (entry) => {
    setItems(withIds(entry.items));
    if (entry.numQuestions) setNumQuestions(entry.numQuestions);
  };

  const startTest = () => {
    addRecentTest(withoutIds(items), numQuestions);
    closeDialog();
    navigate(`/test?portions=${encodeSelection(items)}&numQuestions=${numQuestions}`);
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullScreen={fullScreen} fullWidth maxWidth="md" PaperProps={{ sx: { maxWidth: 720 } }}>
      <DialogTitle>Create Memorisation Test</DialogTitle>
      <DialogContent className="testDialogContent">
        <SetsBar
          pinned={pinnedSet}
          recent={recentTests.map(t => ({ ...t, detail: `${t.numQuestions} questions` }))}
          onPick={pick}
        />

        <div className="test-dialog-caption">
          <span>Test me on</span>
          <span>{verseCount} verses</span>
        </div>
        <SelectionEditor items={items} onChange={setItems} />

        <div className="test-dialog-questions">
          <span>Number of questions</span>
          <Select size="small" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} sx={{ minWidth: 90 }}>
            {Array.from(Array(99).keys()).map((n) => (
              <MenuItem key={n + 1} value={n + 1}>{n + 1}</MenuItem>
            ))}
          </Select>
        </div>
      </DialogContent>
      <DialogActions className="test-dialog-actions">
        <div className="test-dialog-actions-left">
          <ClearButton items={items} onClear={() => setItems([])} />
          <SaveSetButton items={items} extra={{ numQuestions }}
            tooltip="Save this selection and number of questions as a set, to load the same test again with one tap" />
        </div>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button variant="contained" disabled={!items.length} onClick={startTest}>Start Test</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestDialog;
