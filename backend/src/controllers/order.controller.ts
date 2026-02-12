import { Request, Response } from "express";
import { orderService } from "../services/order.service.js";
import {
  createOrderSchema,
  updateStatusSchema,
} from "../validators/order.validator.js";

export const orderController = {
  create(req: Request, res: Response): void {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
      return;
    }

    try {
      const order = orderService.create(parsed.data);
      res.status(201).json(order);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create order";
      res.status(400).json({ error: message });
    }
  },

  getById(req: Request, res: Response): void {
    const order = orderService.getById(req.params.id as string);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  },

  updateStatus(req: Request, res: Response): void {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
      return;
    }

    const order = orderService.updateStatus(
      req.params.id as string,
      parsed.data.status,
    );
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  },
};
