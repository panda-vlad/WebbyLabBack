const isEmpty = require ('./isEmpty');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function filmsValidator(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.format = !isEmpty(data.format) ? data.format : '';
  data.release = !isEmpty(data.release) ? data.release : '';
  data.starting = !isEmpty(data.starting) ? data.starting : '';


  if(data.name.length < 2) {
    errors.name = 'Name must be longer then 2'
  }

  if(data.format !== 'DVD' && data.format !== 'VHS'
    && data.format !== 'Blu-Ray') {
    errors.foramat = 'Format must be DVD or VHS or Blu-Ray'
  }

  if (!isNumeric(data.release)) {
    errors.releaseFormat = 'Release is not a number'
  }

  if (1850 > parseInt(data.release) || parseInt(data.release) > 2020) {
    errors.release = 'Data release must be between 1850 and 2020'
  }

  if (data.starting.length === 0) {
    errors.starting = 'Can not be blank'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
