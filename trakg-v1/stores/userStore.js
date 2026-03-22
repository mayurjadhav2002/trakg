import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create()(
  persist(
    (set, get) => ({
      user: null,
      websites: null,
      activeWebsite: null,
      forms: [],

      loading: {
        user: false,
        websites: false,
        forms: false,
      },

      error: null,

      setUser: (user) => {
        set({ user });
      },

      updateUser: (updates) => {
        const current = get().user;
        if (!current) return;

        set({
          user: {
            ...current,
            ...updates,
          },
        });
      },

      setWebsites: (websites) => {
        set({
          websites,
          activeWebsite: websites?.length ? websites[0] : null,
        });
      },

      setActiveWebsite: (website) => {
        set({ activeWebsite: website });
      },

      removeWebsite: (id) => {
        const current = get().websites || [];
        const filtered = current.filter((w) => w.id !== id);

        set({
          websites: filtered.length ? filtered : null,
          activeWebsite: filtered.length ? filtered[0] : null,
        });
      },

      setForms: (forms) => {
        set({ forms });
      },

      addForm: (form) => {
        const current = get().forms || [];
        set({
          forms: [...current, form],
        });
      },

      updateForm: (formId, updates) => {
        const current = get().forms || [];

        const updated = current.map((form) =>
          form.formId === formId ? { ...form, ...updates } : form,
        );

        set({ forms: updated });
      },

      removeForm: (formId) => {
        const current = get().forms || [];

        const filtered = current.filter((form) => form.formId !== formId);

        set({ forms: filtered });
      },

      formAnalytics: {},

      setFormAnalytics: (formId, analytics) => {
        set((state) => ({
          formAnalytics: {
            ...state.formAnalytics,
            [formId]: analytics,
          },
        }));
      },

      setLoading: (key, value) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: value,
          },
        }));
      },

      setError: (error) => {
        set({ error });
      },

      logout: () => {
        set({
          user: null,
          websites: null,
          activeWebsite: null,
          error: null,
          loading: {
            user: false,
            websites: false,
          },
        });

        localStorage.removeItem("app-storage");
      },
    }),
    {
      name: "app-storage",

      partialize: (state) => ({
        user: state.user,
        websites: state.websites,
        activeWebsite: state.activeWebsite,
      }),
    },
  ),
);
