import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { iif, Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { AuthActions } from '../../../auth/store/actions/index';
import { KymaConfig } from '../../config/kyma-config';
import { OpenIdAuthenticationTokenService } from '../../services/open-id-token/open-id-token.service';
import * as fromActions from '../actions/open-id-token.action';

@Injectable()
export class OpenIdTokenEffect {
  @Effect()
  triggerOpenIdTokenLoading$: Observable<fromActions.LoadOpenIdToken> = iif<
    fromActions.LoadOpenIdToken,
    fromActions.LoadOpenIdToken
  >(
    () => this.config.authentication && this.config.authentication.kyma_enabled,
    this.actions$.pipe(
      ofType<fromActions.LoadOpenIdTokenSuccess>(
        AuthActions.LOAD_USER_TOKEN_SUCCESS
      ),
      withLatestFrom(
        this.actions$.pipe(
          ofType<AuthActions.LoadUserToken>(AuthActions.LOAD_USER_TOKEN)
        )
      ),
      map(
        ([, loginAction]) =>
          new fromActions.LoadOpenIdToken({
            username: loginAction.payload.userId,
            password: loginAction.payload.password,
          })
      )
    )
  );

  @Effect()
  loadOpenIdToken$: Observable<
    fromActions.OpenIdTokenActions
  > = this.actions$.pipe(
    ofType(fromActions.LOAD_OPEN_ID_TOKEN),
    map((action: fromActions.LoadOpenIdToken) => action.payload),
    exhaustMap(payload => {
      return this.openIdTokenService
        .loadOpenIdAuthenticationToken(payload.username, payload.password)
        .pipe(
          map(token => new fromActions.LoadOpenIdTokenSuccess(token)),
          catchError(error => of(new fromActions.LoadOpenIdTokenFail(error)))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private openIdTokenService: OpenIdAuthenticationTokenService,
    private config: KymaConfig
  ) {}
}
