import { store } from "../store/index.js";
import { MenuItem } from "../types/index.js";

export const menuService = {
  getAll(): MenuItem[] {
    return store.menu.getAll();
  },

  getById(id: string): MenuItem | undefined {
    return store.menu.getById(id);
  },
};
