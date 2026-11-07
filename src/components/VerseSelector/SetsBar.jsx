import { useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HistoryIcon from '@mui/icons-material/History';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useSetsStore } from '../../store/useSetsStore.js';
import { itemLabel, selectionSummary, withoutIds } from './selection.js';

const timeAgo = (time) => {
  const minutes = Math.round((Date.now() - time) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
};

const shortLabel = (items) => items.length > 1 ? `${itemLabel(items[0])} +${items.length - 1} more` : itemLabel(items[0]);

export const ClearButton = ({ items, onClear }) => (
  <Button size="small" color="inherit" startIcon={<ClearAllIcon />} disabled={!items.length}
    sx={{ opacity: 0.75, textTransform: 'none' }} onClick={onClear}>
    Clear
  </Button>
);

/** `extra` is stored alongside the set, e.g. { numQuestions } from the test dialog */
export const SaveSetButton = ({ items, extra, tooltip }) => {
  const saveSet = useSetsStore(s => s.saveSet);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');

  const save = () => {
    if (!name.trim()) return;
    saveSet(name.trim(), withoutIds(items), extra);
    setName('');
    setNaming(false);
  };

  if (naming) {
    return (
      <span className='sets-save-form'>
        <TextField size="small" autoFocus placeholder="Name this set" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setNaming(false); }} />
        <Button size="small" variant="contained" onClick={save}>Save</Button>
        <Button size="small" color="inherit" onClick={() => setNaming(false)}>Cancel</Button>
      </span>
    );
  }
  return (
    <Tooltip arrow title={tooltip ?? "Save what's selected as a set, so you can load it again with one tap"}>
      <span>
        <Button size="small" color="inherit" startIcon={<StarBorderIcon />} disabled={!items.length}
          sx={{ opacity: 0.75, textTransform: 'none', whiteSpace: 'nowrap' }} onClick={() => setNaming(true)}>
          Save
        </Button>
      </span>
    </Tooltip>
  );
};

/**
 * Saved (★) sets and recent selections as chips; tapping one loads it.
 * `recent` entries are { id, usedAt, items, detail? }; `detail` is extra text for the chip and tooltip.
 * `pinned` is a set that belongs to the page (e.g. a class's set); it comes first and can't be deleted.
 */
const SetsBar = ({ recent, onPick, pinned }) => {
  const { saved, removeSet } = useSetsStore();
  if (!pinned && !saved.length && !recent.length) return null;

  return (
    <div className='sets-bar'>
      {pinned && (
        <Tooltip title={selectionSummary(pinned.items)} arrow>
          <Chip size="small" color="primary" icon={<StarIcon />} label={pinned.name} onClick={() => onPick(pinned)} />
        </Tooltip>
      )}
      {saved.map(set => (
        <Tooltip key={set.id} title={selectionSummary(set.items)} arrow>
          <Chip size="small" icon={<StarIcon />} label={set.name}
            onClick={() => onPick(set)} onDelete={() => removeSet(set.id)} />
        </Tooltip>
      ))}
      {recent.map(entry => (
        <Tooltip key={entry.id} title={`${selectionSummary(entry.items)}${entry.detail ? ` · ${entry.detail}` : ''} · used ${timeAgo(entry.usedAt)}`} arrow>
          <Chip size="small" variant="outlined" icon={<HistoryIcon />} label={shortLabel(entry.items)}
            onClick={() => onPick(entry)} />
        </Tooltip>
      ))}
    </div>
  );
};

export default SetsBar;
