import * as model from "./model.js";
import recipeView from  "./views/recipeView.js";
import searchView from  "./views/searchView.js";
import resultsView from  "./views/resultsView.js";
import paginationView from  "./views/paginationView.js";
import bookmarksView from  "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import {MODAL_CLOSE_SEC} from "./config.js";


import 'core-js/stable';
import 'regenerator-runtime/runtime';


// if(module.hot){
//   module.hot.accept();
// }

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipes = async function(){
  try{

      const id = window.location.hash.slice(1);

      if(!id){
        return;
      }

      recipeView.renderSpinner();

      //0 Update results view to mark selected serach result
      resultsView.update(model.getSearchResultsPage());

      //1 reload bookmarks
      bookmarksView.update(model.state.bookmarks);

      //2 load recipe
      await model.loadRecipe(id);

      //3 Rendering recipe 
      recipeView.render(model.state.recipe);

  }
  catch (err){
    recipeView.renderError();
    console.log(err);
  }
};

const controlAddRecipe = async function(newRecipe){
  try {

    //Show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form
    setTimeout(function(){
      addRecipeView.toggleWindow() 
    },MODAL_CLOSE_SEC * 1000);
  } catch(err){

    addRecipeView.renderError(err.message);
  }


  //model.uploadRecipe(newRecipe);
}

const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    
    if(!query){
      return;
    }

    // 2) load search results
    await model.loadSearchResults(query);

    // 3) render results

    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
 
  }
  catch(err){
    console.log(err);
  }
}

const controlPagination = function(page){
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
}



const controlServings = function (newServings){
  // Update the recipe serving (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  //add bookmark
  if(!model.state.recipe.bookmarked){
   
    model.addBookmark(model.state.recipe);

  }
  //remove bookmark
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);

}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlInitLoadRecipe = async function(){
  try{
    // if there is an id in the address bar on page load, load the recipe

    const id = window.location.hash.slice(1);

    if(!id){
      return;
    }

    //1 load recipe
    await model.loadRecipe(id);

    //2 Rendering recipe 
    recipeView.render(model.state.recipe);

  }
  catch (err){
    console.log(err);
  }

} 

const newFeature = function(){
  console.log('Welcome to the application!');
}

const init = function(){
  bookmarksView.addHanderRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  recipeView.addHandlerInitLoadRecipe(controlInitLoadRecipe);
  newFeature();
}

init();
