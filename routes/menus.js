const express = require("express");
const {
  getMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menus");