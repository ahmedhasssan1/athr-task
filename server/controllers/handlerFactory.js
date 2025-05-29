const catchAsync=require('./../utility/catchAsync')

exports.deleteone = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('no document exist with this id ', 404));
    }
    res.status(204).json({
      status: 'done',
      data: null,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    console.log("Updating ID:", req.params.id);
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({message:"this document is not found"})
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getIDdoc = (model, populateOption) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (populateOption) query.populate(populateOption);
    const doc = await query;
    if (!doc) {
      return next('threr a error');
    }
    res.status(200).json({
      status: 200,
      data: {
        doc,
      },
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.find();
    res.status(200).json({
      result: doc.length,
      status: 'succes',
      data: {
        doc,
      },
    });
  });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};