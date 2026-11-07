import { useMemo, useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModeToggle from '../ModeToggle/ModeToggle.jsx';
import SubmitButton from '../SubmitButton/SubmitButton.jsx';
import SelectionEditor from './SelectionEditor.jsx';
import SetsBar, { ClearButton, SaveSetButton } from './SetsBar.jsx';
import { useSetsStore } from '../../store/useSetsStore.js';
import { selectionSummary, selectionVerses, withIds } from './selection.js';
import './VerseSelector.css';

/**
 * Picks what to be tested on: any mix of surahs, runs of surahs, verse ranges and juz.
 * Collapsed it's a one-line summary next to the mode toggle and Randomize button;
 * tapping the summary opens the full list to edit.
 */
const VerseSelector = ({ items, onItemsChange, mode, onModeChange, onRandomize, loading, pinnedSet }) => {
  const [open, setOpen] = useState(false);
  const recent = useSetsStore(s => s.recent);
  const verseCount = useMemo(() => selectionVerses(items).length, [items]);

  const pickSet = (set) => onItemsChange(withIds(set.items));

  return (
    <div className='verse-selector'>
      <div className='verse-selector-main'>
        <button type='button' className={`selection-summary ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}
          aria-expanded={open}>
          <span className='selection-summary-text'>
            {items.length ? (
              <>
                <span className='selection-summary-title'>
                  {items.length} {items.length === 1 ? 'selection' : 'selections'} · {verseCount} verses
                </span>
                <span className='selection-summary-list'>{selectionSummary(items)}</span>
              </>
            ) : (
              <span className='selection-summary-title empty'>Choose what to be tested on</span>
            )}
          </span>
          <ExpandMoreIcon className='selection-summary-chevron' />
        </button>
        <div className='verse-selector-actions'>
          <ModeToggle mode={mode} onChange={onModeChange} />
          <SubmitButton onClick={() => onRandomize(items)} loading={loading} disabled={!items.length} />
        </div>
      </div>
      <Collapse in={open}>
        <div className='selection-editor-panel'>
          <SelectionEditor items={items} onChange={onItemsChange} />
          <div className='selection-editor-footer'>
            <ClearButton items={items} onClear={() => onItemsChange([])} />
            <SaveSetButton items={items} />
          </div>
        </div>
      </Collapse>
      <SetsBar pinned={pinnedSet} recent={recent.slice(0, 3)} onPick={pickSet} />
    </div>
  );
};

export default VerseSelector;
