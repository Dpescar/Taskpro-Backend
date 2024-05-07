function wrapControllerFunction(controllerFunction) {
  async function wrappedControllerFunction(req, res, next) {
    try {
      await controllerFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  }
  return wrappedControllerFunction;
}

module.exports = wrapControllerFunction;
