jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  isValidObjectId: jest.fn(),
}));

jest.mock('../utils/asyncHandler', () => (fn) => (req, res, next) => {
    return fn(req, res, next).catch(next);  // Ensure that async errors are passed to next
});

const mongoose = require('mongoose'); // <-- Import it after mocking
const { createMenu } = require('../controllers/testingAPI/createMenu');
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const APIError = require('../utils/APIError');

jest.mock('../models/Restaurant');
jest.mock('../models/Menu');

describe('createMenu', () => {
let req, res, next;

beforeEach(() => {
  req = {
    params: { restaurantId: '507f1f77bcf86cd799439011' },
    body: { 
      name: 'Lunch Menu', 
      picture: 'https://lh3.googleusercontent.com/d/1WKW7wFMyKOaRBM4St0LHHsSFEEmqk93N',
      price: 999,
      type: 'set',
      description: 'This was created by Joy, an employee.',
      tag: ['Signature-dish', 'Spicy'],
    },
  };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  next = jest.fn();
});

test('should create a menu when restaurant exists', async () => {
  mongoose.isValidObjectId.mockReturnValue(true);
  Restaurant.findById.mockResolvedValue({ _id: req.params.restaurantId });
  Menu.create.mockResolvedValue({ ...req.body, restaurant: req.params.restaurantId });

  await createMenu(req, res, next);

  expect(Restaurant.findById).toHaveBeenCalledWith(req.params.restaurantId);
  expect(Menu.create).toHaveBeenCalledWith({ ...req.body, restaurant: req.params.restaurantId });
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    data: { ...req.body, restaurant: req.params.restaurantId },
  });
  expect(next).not.toHaveBeenCalled(); // Should not call next if success
});

test('should throw 404 error if restaurant not found', async () => {
  mongoose.isValidObjectId.mockReturnValue(true);
  Restaurant.findById.mockResolvedValue(null);

  await createMenu(req, res, next);

  expect(next).toHaveBeenCalled();
  const errorPassed = next.mock.calls[0][0];
  expect(errorPassed).toBeInstanceOf(APIError);
  expect(errorPassed.statusCode).toBe(404);
  expect(errorPassed.message).toBe('Restaurant not found');
});

test('should throw 400 error if restaurantId is invalid', async () => {
  mongoose.isValidObjectId.mockReturnValue(false); // invalid ID

  await createMenu(req, res, next);

  expect(next).toHaveBeenCalled();
  const errorPassed = next.mock.calls[0][0];
  expect(errorPassed).toBeInstanceOf(APIError);
  expect(errorPassed.statusCode).toBe(400);
  expect(errorPassed.message).toBe('Invalid id: not an ObjectID');
});
});
  


