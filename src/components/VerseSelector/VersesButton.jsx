import { useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import TuneIcon from '@mui/icons-material/Tune';
import { NumberSelect } from './Pickers.jsx';
import { chapterName, isNarrowed, versesIn } from './selection.js';

/**
 * The "verses" cell of a row. For a single surah it's a pill that opens a verse-range picker;
 * for a run of surahs or juz it just says how many there are.
 */
const VersesButton = ({ item, onChange }) => {
  const [anchor, setAnchor] = useState(null);
  const [range, setRange] = useState([1, 1]);

  if (item.type === 'juz' || item.from !== item.to) {
    const count = item.to - item.from + 1;
    return <span className='verses-count'>{count} {item.type === 'juz' ? 'juz' : 'surahs'}</span>;
  }

  const total = versesIn(item.from);
  const narrowed = isNarrowed(item);
  const open = (e) => {
    setRange(narrowed ? [item.sv, item.ev] : [1, total]);
    setAnchor(e.currentTarget);
  };
  const commit = ([sv, ev]) => onChange(sv === 1 && ev === total ? { sv: null, ev: null } : { sv, ev });
  const set = (next) => { setRange(next); commit(next); };

  return (
    <>
      <Tooltip title="Choose which verses" arrow>
        <Button
          className='verses-button'
          size="small"
          variant={narrowed ? 'contained' : 'outlined'}
          color={narrowed ? 'primary' : 'inherit'}
          endIcon={<TuneIcon sx={{ fontSize: '16px !important' }} />}
          onClick={open}
          sx={narrowed ? {} : { opacity: 0.7, borderColor: 'divider' }}
        >
          {narrowed ? `Verses ${item.sv}–${item.ev}` : `All ${total} verses`}
        </Button>
      </Tooltip>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div className='verses-popover'>
          <div className='verses-popover-header'>
            <b>{chapterName(item.from)}</b>
            <span>{range[0] === 1 && range[1] === total ? `All ${total} verses` : `Verses ${range[0]}–${range[1]}`}</span>
          </div>
          <Slider
            size="small"
            value={range}
            min={1}
            max={total}
            valueLabelDisplay="auto"
            onChange={(e, next) => setRange(next)}
            onChangeCommitted={(e, next) => commit(next)}
          />
          <div className='verses-popover-fields'>
            <NumberSelect label="From" value={range[0]} max={range[1]} onChange={n => set([n, range[1]])} />
            <NumberSelect label="To" value={range[1]} min={range[0]} max={total} onChange={n => set([range[0], n])} />
            <Button size="small" color="inherit" sx={{ ml: 'auto', textTransform: 'none' }}
              onClick={() => { set([1, total]); setAnchor(null); }}>
              Whole surah
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default VersesButton;
