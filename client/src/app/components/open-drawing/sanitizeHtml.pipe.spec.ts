/* tslint:disable */

import { DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitizeHtml.pipe';

describe('Pipe: SanitizeHtmle', () => {
  let dom: DomSanitizer;
  it('create an instance', () => {
    const pipe = new SanitizeHtmlPipe(dom);
    expect(pipe).toBeTruthy();
  });
});
