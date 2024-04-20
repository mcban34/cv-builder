import create from 'zustand';

const useCvDataStore = create(set => ({
    cvData: null,
    setCvData: (data) => set({ cvData: data }),
}));

const useCvThemeStore = create(set => ({
    cvTheme: null,
    setCvTheme: (data) => set({ cvTheme: data }),
}));


export default { useCvDataStore, useCvThemeStore };
