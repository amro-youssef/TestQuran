import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import { JuzSelect, SurahSelect } from './Pickers.jsx';
import VersesButton from './VersesButton.jsx';
import { newItem } from './selection.js';

const SelectionRow = ({ item, onChange, onRemove }) => {
  const isRun = item.to !== item.from;
  const [showEnd, setShowEnd] = useState(isRun);
  const Select = item.type === 'juz' ? JuzSelect : SurahSelect;
  const unit = item.type === 'juz' ? 'juz' : 'surah';

  const closeEnd = () => { onChange({ to: item.from }); setShowEnd(false); };

  return (
    <div className='selection-row'>
      <Select className='selection-start' value={item.from}
        onChange={v => v && onChange({ from: v, to: Math.max(v, item.to), sv: null, ev: null })} />
      <div className='selection-end'>
        {showEnd ? (
          <>
            <span className='selection-end-label'>up to</span>
            <Select className='selection-end-select' value={isRun ? item.to : null} min={item.from}
              placeholder={`Last ${unit}…`} autoFocus={!isRun} onBlurEmpty={() => setShowEnd(false)}
              onChange={v => v ? onChange({ to: v, sv: null, ev: null }) : closeEnd()} />
            {isRun && (
              <Tooltip title={`Just ${item.type === 'juz' ? `Juz ${item.from}` : 'this surah'}`} arrow>
                <IconButton size="small" onClick={closeEnd}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          <Button size="small" color="inherit" className='selection-end-add' onClick={() => setShowEnd(true)}>
            + up to…
          </Button>
        )}
      </div>
      <VersesButton item={item} onChange={onChange} />
      <IconButton size="small" onClick={onRemove} aria-label="remove"><CloseIcon fontSize="small" /></IconButton>
    </div>
  );
};

/** One row per item, plus an empty row at the bottom to add the next surah (or juz) from */
const SelectionEditor = ({ items, onChange }) => {
  const [addType, setAddType] = useState('surah');
  const [addKey, setAddKey] = useState(0); // remounts the empty picker after each add
  const AddSelect = addType === 'juz' ? JuzSelect : SurahSelect;

  const update = (id, fields) => onChange(items.map(i => i.id === id ? { ...i, ...fields } : i));
  const add = (value) => {
    if (!value) return;
    onChange([...items, newItem({ type: addType, from: value, to: value })]);
    setAddKey(k => k + 1);
  };

  return (
    <div className='selection-editor'>
      {items.map(item => (
        <SelectionRow key={item.id} item={item}
          onChange={fields => update(item.id, fields)}
          onRemove={() => onChange(items.filter(i => i.id !== item.id))} />
      ))}
      <div className='selection-row selection-add-row'>
        <AddSelect key={addKey} className='selection-start' value={null}
          placeholder={addType === 'juz' ? '+ Add a juz…' : '+ Add a surah…'} onChange={add} />
        <div className='selection-end'>
          <Button size="small" color="inherit" className='selection-end-add'
            onClick={() => setAddType(t => t === 'juz' ? 'surah' : 'juz')}>
            {addType === 'juz' ? 'Add a surah' : 'Add a juz'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectionEditor;
