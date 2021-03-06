import { inject, TestBed } from '@angular/core/testing';
import * as ngrxStore from '@ngrx/store';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { Review } from '../../model/product.model';
import * as fromStore from '../store/index';
import { ProductReviewService } from './product-review.service';

describe('ReviewService', () => {
  let service: ProductReviewService;
  let store: Store<fromStore.ProductsState>;
  const mockReview: Review = { id: 'testId' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('products', fromStore.getReducers()),
      ],
      providers: [ProductReviewService],
    });

    store = TestBed.get(Store);
    service = TestBed.get(ProductReviewService);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should ReviewService is injected', inject(
    [ProductReviewService],
    (reviewService: ProductReviewService) => {
      expect(reviewService).toBeTruthy();
    }
  ));

  describe('getByProductCode(productCode)', () => {
    it('should be able to get product reviews if reviews exist', () => {
      spyOnProperty(ngrxStore, 'select').and.returnValue(() => () =>
        of([mockReview])
      );
      let result: Review[];
      service.getByProductCode('testId').subscribe(reviews => {
        result = reviews;
      });
      expect(result).toEqual([mockReview]);
    });

    it('should be able to load product reviews if reviews not exist', () => {
      spyOnProperty(ngrxStore, 'select').and.returnValue(() => () =>
        of(undefined)
      );
      service
        .getByProductCode('testId')
        .subscribe()
        .unsubscribe();

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.LoadProductReviews('testId')
      );
    });
  });

  describe('add(productCode, review)', () => {
    it('should be able to add review for product', () => {
      const productCode = 'testId';
      const review: Review = { id: '123', comment: 'test review' };
      service.add(productCode, review);
      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.PostProductReview({ productCode, review })
      );
    });
  });
});
