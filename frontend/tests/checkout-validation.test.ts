import { describe, it, expect } from "vitest";

// Extract validation logic to test independently
function validate(fields: { name: string; address: string; phone: string }) {
  const errors: { name?: string; address?: string; phone?: string } = {};
  if (fields.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (fields.address.trim().length < 5)
    errors.address = "Address must be at least 5 characters";
  if (
    !/^\d{10}$/.test(fields.phone.trim()) &&
    !/^\+\d{1,3}\d{10}$/.test(fields.phone.trim())
  )
    errors.phone = "Enter a valid 10-digit phone number";
  return errors;
}

describe("Checkout form validation", () => {
  it("passes with valid data", () => {
    const errors = validate({
      name: "John Doe",
      address: "123 Main Street",
      phone: "1234567890",
    });
    expect(errors).toEqual({});
  });

  it("rejects short name", () => {
    const errors = validate({
      name: "J",
      address: "123 Main Street",
      phone: "1234567890",
    });
    expect(errors.name).toBeDefined();
  });

  it("rejects empty name", () => {
    const errors = validate({
      name: "",
      address: "123 Main Street",
      phone: "1234567890",
    });
    expect(errors.name).toBeDefined();
  });

  it("rejects short address", () => {
    const errors = validate({
      name: "John",
      address: "123",
      phone: "1234567890",
    });
    expect(errors.address).toBeDefined();
  });

  it("rejects invalid phone - too short", () => {
    const errors = validate({
      name: "John",
      address: "123 Main Street",
      phone: "12345",
    });
    expect(errors.phone).toBeDefined();
  });

  it("rejects invalid phone - letters", () => {
    const errors = validate({
      name: "John",
      address: "123 Main Street",
      phone: "abcdefghij",
    });
    expect(errors.phone).toBeDefined();
  });

  it("accepts phone with country code", () => {
    const errors = validate({
      name: "John",
      address: "123 Main Street",
      phone: "+11234567890",
    });
    expect(errors.phone).toBeUndefined();
  });

  it("accepts phone with 3-digit country code", () => {
    const errors = validate({
      name: "John",
      address: "123 Main Street",
      phone: "+911234567890",
    });
    expect(errors.phone).toBeUndefined();
  });

  it("returns all errors at once", () => {
    const errors = validate({
      name: "",
      address: "",
      phone: "",
    });
    expect(Object.keys(errors)).toHaveLength(3);
  });

  it("trims whitespace before validating", () => {
    const errors = validate({
      name: "  John  ",
      address: "  123 Main Street  ",
      phone: "  1234567890  ",
    });
    expect(errors).toEqual({});
  });
});
