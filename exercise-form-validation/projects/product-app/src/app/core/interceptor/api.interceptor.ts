import { HttpInterceptorFn } from '@angular/common/http';

import {  environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    url: `${environment.API_URL}${req.url}`,
  });
  return next(req);
};
