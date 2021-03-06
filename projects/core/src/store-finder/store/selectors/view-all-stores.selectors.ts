import { createSelector, MemoizedSelector } from '@ngrx/store';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import {
  loaderLoadingSelector,
  loaderValueSelector,
} from '../../../state/utils/loader/loader.selectors';
import {
  StateWithStoreFinder,
  StoresState,
  ViewAllStoresState,
} from '../store-finder-state';
import { getStoreFinderState } from './feature.selector';

export const getViewAllStoresState: MemoizedSelector<
  StateWithStoreFinder,
  LoaderState<ViewAllStoresState>
> = createSelector(
  getStoreFinderState,
  (storesState: StoresState) => storesState.viewAllStores
);

export const getViewAllStoresEntities: MemoizedSelector<
  StateWithStoreFinder,
  ViewAllStoresState
> = createSelector(
  getViewAllStoresState,
  state => loaderValueSelector(state)
);

export const getViewAllStoresLoading: MemoizedSelector<
  StateWithStoreFinder,
  boolean
> = createSelector(
  getViewAllStoresState,
  state => loaderLoadingSelector(state)
);
