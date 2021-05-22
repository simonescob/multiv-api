import { config } from '../../config';
import boom from '@hapi/boom';

function withErrorStack(error, stack) {
  if (config.dev) {
    return { ...error, stack };
  }
  return error;
}

function logErrors(error, req, res, next) {
  console.log(error);
  next(error);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }
  next(err);
}

function errorHandler(error, req, res, next) {
  const {
    output: { statusCode, payload },
  } = error;

  res
    .status(statusCode)
    .json(
      withErrorStack(
        payload || 'Ups... something went wrong, please try in a while.',
        error.stack
      )
    );
}

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
