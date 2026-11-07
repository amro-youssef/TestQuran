import { create } from "zustand";
import { persist } from "zustand/middleware";

// A set is a list of selection items: { type: 'surah'|'juz', from, to, sv, ev } (see VerseSelector/selection.js)

const MAX_RECENT = 5;
const sameItems = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const useSetsStore = create(
  persist(
    (set) => ({
      saved: [],
      recent: [],
      recentTests: [],

      // extra holds anything else worth remembering with the set, e.g. { numQuestions }
      saveSet: (name, items, extra = {}) =>
        set((state) => ({
          saved: [...state.saved, { id: Date.now(), name, items, ...extra }]
        })),

      removeSet: (id) =>
        set((state) => ({
          saved: state.saved.filter((s) => s.id !== id)
        })),

      // called whenever a test is generated, so the last few selections can be reloaded in one tap
      addRecent: (items) =>
        set((state) => ({
          recent: [
            { id: Date.now(), usedAt: Date.now(), items },
            ...state.recent.filter((r) => !sameItems(r.items, items))
          ].slice(0, MAX_RECENT)
        })),

      // memorisation tests started from the test dialog, with how many questions they had
      addRecentTest: (items, numQuestions) =>
        set((state) => ({
          recentTests: [
            { id: Date.now(), usedAt: Date.now(), items, numQuestions },
            ...state.recentTests.filter((r) => !sameItems(r.items, items))
          ].slice(0, MAX_RECENT)
        }))
    }),
    {
      name: "verse-sets" // stored in localStorage
    }
  )
);
