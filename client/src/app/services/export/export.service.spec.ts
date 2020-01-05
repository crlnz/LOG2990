/* tslint:disable */

import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { ExportService } from './export.service';

class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any , child: any) {
    return ;
  }
  createElement(name: string) {
    if (name === 'a') {
    return document.createElement('a');
    } else {
      return document.createElement('canvas');
    }
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any, child: any) {
    return;
  }
}
class MockRendererFactory {
  createRenderer(renderer: any, element: any) {
    return new MockRenderer();
  }
}
describe('ExportService', () => {
  let service: ExportService;
  let renderer: Renderer2;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingImportsModule],
      providers: [{provide: ElementRef},
        {provide: Renderer2, useClass: MockRenderer}, {provide: RendererFactory2, useClass: MockRendererFactory}],
    });
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportService],
    });
    service = TestBed.get(ExportService);

  });

  it('should be created', () => {
    const service: ExportService = TestBed.get(ExportService);
    expect(service).toBeTruthy();
  });

  it('should exportSVG', () => {
    const mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    const service: ExportService = TestBed.get(ExportService);
    service['exportFileType'] = 'svg';
    const rendererFactory = TestBed.get(RendererFactory2);
    const spy = spyOn(service, 'triggerDownload');
    service.exportSvg(mockElementRef, rendererFactory, '1', '1');
    expect(spy).toHaveBeenCalled();
  });

  it('should exportSVG', () => {
    const mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    const service: ExportService = TestBed.get(ExportService);
    service['exportFileType'] = 'jpeg';
    const rendererFactory = TestBed.get(RendererFactory2);
    spyOn(service, 'triggerDownload');
    const renderer = TestBed.get(Renderer2);
    spyOn(renderer, 'removeChild');
    service.exportSvg(mockElementRef, rendererFactory, '1', '1');
    expect(service['exportFileType']).toEqual('jpeg');
  });

  it('should return an Observable<Event> when listenExportClick is clicked', async(() => {
    const event: Observable<Event> = service.listenExportClick();
    spyOn(service, 'listenExportClick').and.returnValue(of<any>(event));
    expect(typeof service['exportClick']).toEqual(typeof event);
  }));

  it('should call the next method when createDrawingClicked() is called', async(() => {
    const event: Subject<Event> = service['exportClick'];
    service.exportClicked();
    spyOn(service['exportClick'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['exportClick']);
  }));
  it('should create download link', () => {
    const service: ExportService = TestBed.get(ExportService);
    service['exportFileType'] = '.svg';
    const renderer = TestBed.get(Renderer2);
    const spy = spyOn(renderer, 'createElement');
    service.triggerDownload(renderer, 'uri', 'filename');
    expect(spy).toHaveBeenCalled();
  });

});
