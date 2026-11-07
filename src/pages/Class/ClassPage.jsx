import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, MenuItem, LinearProgress, Collapse } from '@mui/material';
import Home from '../Home/Home.jsx';
import { CHRONOLOGICAL_ORDER } from './chronologicalOrder.js';
import { chapterName, encodeSelection } from '../../components/VerseSelector/selection.js';
import { useSetsStore } from '../../store/useSetsStore.js';
import './ClassPage.css';

/**
 * A class's progress lives in classes/<id>.json. The page reads the latest copy of that file from
 * GitHub, so moving the class on a week only needs that file edited on github.com — no rebuild.
 * The bundled copy is used if GitHub can't be reached.
 */
const bundledConfigs = import.meta.glob('./classes/*.json', { eager: true, import: 'default' });
const liveConfigUrl = (id) =>
  `https://raw.githubusercontent.com/amro-youssef/TestQuran/master/src/pages/Class/classes/${id}.json`;

const isValidConfig = (c) => Number.isInteger(c?.coveredUpTo) && c.coveredUpTo >= 1 && c.coveredUpTo <= CHRONOLOGICAL_ORDER.length;

const useClassConfig = (id) => {
  const bundled = bundledConfigs[`./classes/${id}.json`];
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    fetch(liveConfigUrl(id), { cache: 'no-store', signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(live => setConfig(isValidConfig(live) ? live : bundled))
      .catch(() => setConfig(bundled))
      .finally(() => clearTimeout(timeout));
    return () => controller.abort();
  }, [id]);

  return config;
};

const ClassIntro = ({ config, surahs, items }) => {
  const navigate = useNavigate();
  const addRecentTest = useSetsStore(s => s.addRecentTest);
  const [numQuestions, setNumQuestions] = useState(10);
  const [showSurahs, setShowSurahs] = useState(false);
  const covered = surahs.length;
  const latest = surahs[covered - 1];

  const startTest = () => {
    addRecentTest(items, numQuestions);
    navigate(`/test?portions=${encodeSelection(items)}&numQuestions=${numQuestions}`);
  };

  return (
    <div className='class-intro'>
      <h2 className='class-title'>{config.name}</h2>
      <div className='class-progress-text'>
        <span>{covered} of {CHRONOLOGICAL_ORDER.length} surahs, in order of revelation</span>
        <span>up to {chapterName(latest)}</span>
      </div>
      <LinearProgress variant='determinate' value={100 * covered / CHRONOLOGICAL_ORDER.length} className='class-progress' />

      <div className='class-actions'>
        <Button variant='contained' onClick={startTest}>Start a class test</Button>
        <Select size='small' value={numQuestions} onChange={e => setNumQuestions(e.target.value)}>
          {[5, 10, 15, 20, 30].map(n => <MenuItem key={n} value={n}>{n} questions</MenuItem>)}
        </Select>
        <Button size='small' color='inherit' className='class-surahs-toggle' onClick={() => setShowSurahs(s => !s)}>
          {showSurahs ? 'Hide surahs' : 'Show surahs'}
        </Button>
      </div>

      <Collapse in={showSurahs}>
        <ol className='class-surah-list'>
          {surahs.map(c => <li key={c}>{chapterName(c)} <span>{c}</span></li>)}
        </ol>
      </Collapse>

      <p className='class-hint'>Or pick a random verse from what we've covered below, and narrow it down if you like.</p>
    </div>
  );
};

/** A class revision page, e.g. /icm2025: the home page preset to the surahs the class has covered */
const ClassPage = ({ classId, ...homeProps }) => {
  const config = useClassConfig(classId);
  const surahs = useMemo(() => config ? CHRONOLOGICAL_ORDER.slice(0, config.coveredUpTo) : [], [config]);
  const items = useMemo(() => surahs.map(c => ({ type: 'surah', from: c, to: c })), [surahs]);

  if (!config) return <div className='App class-loading'>Loading…</div>;

  return (
    <Home
      // remount when the covered surahs change so the selection resets to them
      key={config.coveredUpTo}
      {...homeProps}
      initialSelection={items}
      intro={<ClassIntro config={config} surahs={surahs} items={items} />}
    />
  );
};

export default ClassPage;
