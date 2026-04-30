import { create } from "zustand";
import { persist } from "zustand/middleware";

// type Status = "memorised" | "needs_revision" | "unmemorised"


export const useQuranStore = create(
  persist(
    (set) => ({
      progress: {},

      updateVerse: (chapter, verse, status)  =>
        set((state) => ({
          progress: {
            ...state.progress,
            [chapter]: {
              ...state.progress[chapter],
              [verse]: {
                status,
                updatedAt: Date.now()
              }
            }
          }
        }))
    }),
    {
      name: "quran-progress" // stored in localStorage
    }
  )
);