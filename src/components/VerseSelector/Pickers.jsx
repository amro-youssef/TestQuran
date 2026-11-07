import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { chapters, JUZ_COUNT } from './selection.js';

const JUZ = Array.from({ length: JUZ_COUNT }, (_, i) => i + 1);

// ignore punctuation so "yas" finds Ya-Sin and "adiyat" finds Al-'Adiyat
const surahFilter = createFilterOptions({ stringify: c => `${c.label} ${c.name.replace(/[^a-z]/gi, '')}` });

export const SurahSelect = ({ value, onChange, min = 1, placeholder = 'Choose a surah…', autoFocus, onBlurEmpty, className }) => (
  <Autocomplete
    size="small"
    className={className}
    options={chapters.slice(min - 1)}
    filterOptions={surahFilter}
    getOptionLabel={c => c.label}
    isOptionEqualToValue={(a, b) => a.id === b.id}
    value={value ? chapters[value - 1] : null}
    disableClearable={!!value}
    openOnFocus
    autoHighlight
    onChange={(e, c) => onChange(c ? c.id : null)}
    onBlur={() => !value && onBlurEmpty?.()}
    renderInput={params => <TextField {...params} placeholder={placeholder} autoFocus={autoFocus} />}
  />
);

export const JuzSelect = ({ value, onChange, min = 1, placeholder = 'Choose a juz…', autoFocus, onBlurEmpty, className }) => (
  <Autocomplete
    size="small"
    className={className}
    options={JUZ.slice(min - 1)}
    getOptionLabel={j => `Juz ${j}`}
    value={value ?? null}
    disableClearable={!!value}
    openOnFocus
    autoHighlight
    onChange={(e, j) => onChange(j ?? null)}
    onBlur={() => !value && onBlurEmpty?.()}
    renderInput={params => <TextField {...params} placeholder={placeholder} autoFocus={autoFocus} />}
  />
);

export const NumberSelect = ({ value, onChange, min = 1, max, label }) => (
  <Autocomplete
    size="small"
    sx={{ width: 96 }}
    disableClearable
    options={Array.from({ length: max - min + 1 }, (_, i) => String(i + min))}
    value={String(value)}
    onChange={(e, v) => onChange(Number(v))}
    renderInput={params => <TextField {...params} label={label} />}
  />
);
