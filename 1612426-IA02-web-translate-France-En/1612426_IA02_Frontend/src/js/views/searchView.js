export const getInput = () => document.querySelector('.query__description').value;

export const clearInput = () => document.querySelector('.query__description').value = '';

export const showResults = (franceWord, vietnamWord) => {
  document.getElementById('france-item').innerHTML = franceWord
  document.getElementById('vietnam-item').innerHTML = vietnamWord
}

export const notifyWordNotFound = query => {
  alert(`"${query}" is not exist in dictionary !!!`)
  document.querySelector('.query__description').focus()
}