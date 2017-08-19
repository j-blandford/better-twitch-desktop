// augmentations.ts
// TODO: Remove this when RxJS releases a stable version with a correct declaration of `Subject`.
import {Operator} from 'rxjs-es/Operator';
import {Observable} from 'rxjs-es/Observable';

declare module 'rxjs-es/Subject' {
  interface Subject<T> {
    lift<R>(operator: Operator<T, R>): Observable<R>
  }
}