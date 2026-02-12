import { Request, Response } from "express";
import { menuService } from "../services/menu.service.js";

export const menuController = {
  getAll(_req: Request, res: Response): void {
    const items = menuService.getAll();
    res.status(200).json(items);
  },

  getById(req: Request, res: Response): void {
    const item = menuService.getById(req.params.id as string);
    if (!item) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    res.status(200).json(item);
  },
};
