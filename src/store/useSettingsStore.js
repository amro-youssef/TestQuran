import { create } from "zustand";

// Settings shared between the sidebar and the audio/visual mode toggle.
// Stored under the existing plain localStorage keys so other code reading them keeps working.

export const useSettingsStore = create((set) => ({
  hideVerse: localStorage.getItem('alwaysHideVerse') === 'true',
  autoPlayAudio: localStorage.getItem('autoPlayAudio') === 'true',

  setHideVerse: (hideVerse) => {
    localStorage.setItem('alwaysHideVerse', hideVerse);
    set({ hideVerse });
  },

  setAutoPlayAudio: (autoPlayAudio) => {
    localStorage.setItem('autoPlayAudio', autoPlayAudio);
    set({ autoPlayAudio });
  },

  // audio mode = hide the verse and auto-play it; visual mode = the opposite
  setMode: (mode) => {
    const audio = mode === 'audio';
    localStorage.setItem('alwaysHideVerse', audio);
    localStorage.setItem('autoPlayAudio', audio);
    set({ hideVerse: audio, autoPlayAudio: audio });
  }
}));

export const selectMode = (state) => (state.hideVerse && state.autoPlayAudio) ? 'audio' : 'visual';
