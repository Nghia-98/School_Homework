
import SearchFrEn from './models/SearchFrEn.js';
import SearchEnVn from './models/SearchEnVn.js';
import * as searchView from './views/searchView.js'


// auto focus on input field
$(document).ready(function () {
  $(".query__description").focus();
});

/* ---- Global state of the app ---- */
const state = {}

// app controller, connect between search models and search view
const searchController = async () => {

  // 1. Get the query input the UI
  const query = searchView.getInput()

  // 2. Clear the input field
  searchView.clearInput()

  // 3. if query exist Call api to get English word and save into state global, else get out the event
  if (query) {
    try {
      state.searchFrEn = new SearchFrEn(query)  //save into state (global object)
      await state.searchFrEn.getResult()        //call api
    } catch (error) {
      console.log('error: ', error);
      alert(error);
      document.querySelector('.query__description').focus()
    }
  } else {
    return;
  }

  // 4. if get English word successfully => call api to get Vietnam word, else notify word not found to the UI
  if (state.searchFrEn.result.success) {
    state.searchEnVn = new SearchEnVn(state.searchFrEn.result.en)
    try {
      await state.searchEnVn.getResult()
      // 4. if get Vn word successfully => show result to the UI, else notify word not found to the UI
      if (state.searchEnVn.result.success) {
        searchView.showResults(query, state.searchEnVn.result.vn)
      } else {
        searchView.notifyWordNotFound(query)
        document.querySelector('.query__description').focus()
      }
    } catch (error) {
      console.log('error: ', error);
      alert(error);
      document.querySelector('.query__description').focus()
    }
  } else {
    searchView.notifyWordNotFound(query)
    document.querySelector('.query__description').focus()
  }

}


// ------------------ Event listeners when hit enter or click button search------------------------------

document.querySelector('.query__btn').addEventListener('click', searchController)

document.querySelector('.query__description').addEventListener("keydown", envent => {
  if (event.keyCode === 13 || event.which === 13) {
    searchController();
  }
})