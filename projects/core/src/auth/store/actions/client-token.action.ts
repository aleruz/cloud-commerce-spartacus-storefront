import {
  LoaderFailAction,
  LoaderLoadAction,
  LoaderSuccessAction,
} from '../../../state/utils/loader/loader.action';
import { ClientToken } from '../../models/token-types.model';
import { CLIENT_TOKEN_DATA } from '../auth-state';

export const LOAD_CLIENT_TOKEN = '[Token] Load Client Token';
export const LOAD_CLIENT_TOKEN_FAIL = '[Token] Load Client Token Fail';
export const LOAD_CLIENT_TOKEN_SUCCESS = '[Token] Load Client Token Success';

export class LoadClientToken extends LoaderLoadAction {
  readonly type = LOAD_CLIENT_TOKEN;
  constructor() {
    super(CLIENT_TOKEN_DATA);
  }
}

export class LoadClientTokenFail extends LoaderFailAction {
  readonly type = LOAD_CLIENT_TOKEN_FAIL;
  constructor(public payload: any) {
    super(CLIENT_TOKEN_DATA, payload);
  }
}

export class LoadClientTokenSuccess extends LoaderSuccessAction {
  readonly type = LOAD_CLIENT_TOKEN_SUCCESS;
  constructor(public payload: ClientToken) {
    super(CLIENT_TOKEN_DATA);
  }
}

export type ClientTokenAction =
  | LoadClientToken
  | LoadClientTokenFail
  | LoadClientTokenSuccess;
