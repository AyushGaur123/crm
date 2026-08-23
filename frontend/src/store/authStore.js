


import { create } from "zustand";
import authService from "../services/authService";

const storedToken =
  localStorage.getItem("leadflow_token");

const useAuthStore = create((set) => ({
  user: null,

  token: storedToken,

  loading: false,

  initialized: false,

  login: async (data) => {
    set({ loading: true });

    try {
      const response =
        await authService.login(data);

      localStorage.setItem(
        "leadflow_token",
        response.token
      );

      set({
        user: response.user,
        token: response.token,
        loading: false,
        initialized: true,
      });

      return response;

    } catch (error) {
      set({
        loading: false,
        initialized: true,
      });

      throw error;
    }
  },


  // Get current admin from backend
  loadUser: async () => {
    const token =
      localStorage.getItem(
        "leadflow_token"
      );

    // No token means not logged in
    if (!token) {
      set({
        user: null,
        token: null,
        initialized: true,
      });

      return;
    }

    try {
      set({
        loading: true,
      });

      const response =
        await authService.getMe();

      set({
        user: response.user,
        token,
        loading: false,
        initialized: true,
      });

    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      // Token is invalid/expired
      localStorage.removeItem(
        "leadflow_token"
      );

      set({
        user: null,
        token: null,
        loading: false,
        initialized: true,
      });
    }
  },


  logout: () => {
    localStorage.removeItem(
      "leadflow_token"
    );

    set({
      user: null,
      token: null,
      initialized: true,
    });
  },
}));

export default useAuthStore;