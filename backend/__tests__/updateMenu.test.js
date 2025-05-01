jest.mock("../utils/asyncHandler", () => (fn) => (req, res, next) => {
  return fn(req, res, next).catch(next); // Ensure that async errors are passed to next
});

const mongoose = require("mongoose"); // <-- Import it after mocking
const { updateMenu } = require("../controllers/testingAPI/updateMenu");
const Menu = require("../models/Menu");
const APIError = require("../utils/APIError");

jest.mock("../models/Restaurant");
jest.mock("../models/Menu");

beforeEach(() => {
  req = {
    params: { menuId: "507f1f77bcf86cd799439011" },
    body: {
      price: 100,
      tag: ["Nut-free", "Sustainable", "Locally-sourced"],
      description: "A Simple Omlette. Not much to it, but definitely tastes amazing.",
    },
  };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  next = jest.fn();
});

test("should update menu when menu exists", async () => {
  const updatedMenu = { _id: req.params.id, ...req.body };
  Menu.findByIdAndUpdate.mockResolvedValue(updatedMenu);

  await updateMenu(req, res, next);

  expect(Menu.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: updatedMenu,
  });
  expect(next).not.toHaveBeenCalled();
});

test("should throw 404 error if menu not found", async () => {
  Menu.findByIdAndUpdate.mockResolvedValue(null);

  await updateMenu(req, res, next);

  expect(next).toHaveBeenCalled();
  const errorPassed = next.mock.calls[0][0];
  expect(errorPassed).toBeInstanceOf(APIError);
  expect(errorPassed.statusCode).toBe(404);
  expect(errorPassed.message).toBe("Menu not found");
});
