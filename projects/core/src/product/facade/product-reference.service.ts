import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductReference } from '../../model/product.model';
import * as fromProductActions from '../store/actions/index';
import { StateWithProduct } from '../store/product-state';
import { ProductSelectors } from '../store/selectors/index';

@Injectable()
export class ProductReferenceService {
  constructor(protected store: Store<StateWithProduct>) {}

  get(
    productCode: string,
    referenceType?: string,
    pageSize?: number
  ): Observable<ProductReference[]> {
    return this.store.pipe(
      select(ProductSelectors.getSelectedProductReferencesFactory(productCode)),
      tap(references => {
        if (references === undefined && productCode !== undefined) {
          this.store.dispatch(
            new fromProductActions.LoadProductReferences({
              productCode,
              referenceType,
              pageSize,
            })
          );
        }
      })
    );
  }
}
