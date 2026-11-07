import { useEffect, useMemo, useState } from 'react';
import Home from '../Home/Home.jsx';
import TestDialog from '../../dialogs/TestDialog/TestDialog.jsx';
import { CHRONOLOGICAL_ORDER } from './chronologicalOrder.js';
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

/**
 * A class page, e.g. /icm2025: the normal home page, starting on the surahs the class has covered
 * (in order of revelation), with them also offered as a set named after the class.
 */
const ClassPage = ({ classId, testDialogOpen, closeTestDialog, ...homeProps }) => {
  const config = useClassConfig(classId);
  const items = useMemo(
    () => config ? CHRONOLOGICAL_ORDER.slice(0, config.coveredUpTo).map(c => ({ type: 'surah', from: c, to: c })) : [],
    [config]
  );

  if (!config) return <div className='App class-loading'>Loading…</div>;

  const classSet = { id: classId, name: config.setName ?? config.name, items };
  return (
    <>
      <Home
        // remount when the covered surahs change so the selection resets to them
        key={config.coveredUpTo}
        {...homeProps}
        initialSelection={items}
        pinnedSet={classSet}
      />
      {testDialogOpen && <TestDialog open closeDialog={closeTestDialog} pinnedSet={classSet} />}
    </>
  );
};

export default ClassPage;
