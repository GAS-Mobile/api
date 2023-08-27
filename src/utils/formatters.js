const formatCNPJ = (cnpj) => {
  const numericOnly = cnpj.replace(/\D/g, '')
  let formattedCNPJ = ''

  if (numericOnly.length <= 2) {
    formattedCNPJ = numericOnly
  } else if (numericOnly.length <= 5) {
    formattedCNPJ = 
      numericOnly.slice(0, 2) +
      '.' + 
      numericOnly.slice(2)
  } else if (numericOnly.length <= 8) {
    formattedCNPJ =
      numericOnly.slice(0, 2) +
      '.' +
      numericOnly.slice(2, 5) +
      '.' +
      numericOnly.slice(5)
  } else if (numericOnly.length <= 12){
    formattedCNPJ =
      numericOnly.slice(0, 2) +
      '.' +
      numericOnly.slice(2, 5) +
      '.' +
      numericOnly.slice(5, 8) +
      '/' +
      numericOnly.slice(8)
  } else {
    formattedCNPJ =
      numericOnly.slice(0, 2) +
      '.' +
      numericOnly.slice(2, 5) +
      '.' +
      numericOnly.slice(5, 8) +
      '/' +
      numericOnly.slice(8, 12) +
      '-' +
      numericOnly.slice(12)
  }

  return formattedCNPJ
}

module.exports = {
  formatCNPJ
}