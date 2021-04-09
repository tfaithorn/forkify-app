"use strict";

import View from './View.js';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View{
    _parentElement = document.querySelector(".pagination");

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest(".btn--inline");
            const page = parseInt(btn.dataset.page);
            handler(page);
        });
    }

    _generateMarkup(){
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1, and there are other pages
        if(curPage === 1 && numPages > 1){
            return `
            <button class="btn--inline pagination__btn--next" data-page="${curPage+1}">
                <span>Page ${curPage+1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
        }

        // last page
        if(curPage === numPages && numPages > 1){
            return `
                <button class="btn--inline pagination__btn--prev" data-page="${curPage-1}">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage-1}</span>
                </button>`;
        }

        //other page
        if(curPage < numPages){
            return `
            <button class="btn--inline pagination__btn--next" data-page="${curPage+1}">
                <span>Page ${curPage+1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            <button class="btn--inline pagination__btn--prev" data-page="${curPage-1}">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage-1}</span>
            </button>`;
        }

        
        // Page 1, and here are NO other pages
        return 'only 1 page';
    }
}

export default new PaginationView();