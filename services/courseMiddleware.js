module.exports = {
  requireCreator: (req, res, next) => {
    if (!req.user.contentCreator)
      res.status(422).json("Not content creator");
    next();
  }
}