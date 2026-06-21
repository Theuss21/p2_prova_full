const Vehicle = require('../models/Vehicle');
const ClothingBrand = require('../models/ClothingBrand');

// CREATE
exports.createVehicle = async (req, res) => {
  try {
    const item = await Vehicle.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ
exports.listVehicles = async (req, res) => {
  try {
    const items = await Vehicle.find({
      type: req.params.type
    });

    res.json(items);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// UPDATE
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        error: 'Veículo não encontrado'
      });
    }

    res.json(vehicle);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

// DELETE
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        error: 'Veículo não encontrado'
      });
    }

    res.json({
      message: 'Veículo removido'
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};