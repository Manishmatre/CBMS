const express = require('express');
const router = express.Router();
const {
  createDesignation,
  getDesignations,
  getDesignation,
  updateDesignation,
  deleteDesignation
} = require('../controllers/designationController');

router.route('/')
  .get(getDesignations)
  .post(createDesignation);

router.route('/:id')
  .get(getDesignation)
  .put(updateDesignation)
  .delete(deleteDesignation);

module.exports = router;