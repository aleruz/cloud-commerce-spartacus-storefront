import { Injectable } from '@angular/core';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductSearchPage, Suggestion } from '../../model/index';
import { SearchConfig } from '../model';
import * as fromStore from '../store/index';
import { ProductSelectors } from '../store/selectors/index';
import { ProductSearchService } from './product-search.service';

@Injectable({
  providedIn: 'root',
})
export class SearchboxService extends ProductSearchService {
  /**
   * dispatch the search for the search box
   */
  search(query: string, searchConfig?: SearchConfig): void {
    this.store.dispatch(
      new fromStore.SearchProducts(
        {
          queryText: query,
          searchConfig: searchConfig,
        },
        true
      )
    );
  }

  getResults(): Observable<ProductSearchPage> {
    return this.store.pipe(select(ProductSelectors.getAuxSearchResults));
  }

  /**
   * clears the products and suggestions
   */
  clearResults(): void {
    this.store.dispatch(
      new fromStore.ClearProductSearchResult({
        clearSearchboxResults: true,
      })
    );
  }

  getSuggestionResults(): Observable<Suggestion[]> {
    return this.store.pipe(select(ProductSelectors.getProductSuggestions));
  }

  searchSuggestions(query: string, searchConfig?: SearchConfig): void {
    this.store.dispatch(
      new fromStore.GetProductSuggestions({
        term: query,
        searchConfig: searchConfig,
      })
    );
  }
}
