import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { SvgAttributes, SvgTypes } from 'src/app/components/svg-attributes';

const CLICK = 'click';
const CANVAS_CONTEXT = '2d';
const CANVAS = 'canvas';
const PERIOD = '.';
const JPEG = 'jpeg';
const JPG = 'jpg';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private exportClick: Subject<Event> = new Subject<Event>();
  exportFileType: string;
  exportFileName: string;

  listenExportClick(): Observable<Event> {
    return this.exportClick.asObservable();
  }

  exportClicked(): void {
    return this.exportClick.next();
  }

  triggerDownload(renderer: Renderer2, imgURI: string, fileName: string) {
    const click = new MouseEvent(CLICK);
    const a = renderer.createElement(SvgTypes.A);
    renderer.setAttribute(a, SvgAttributes.DOWNLOAD, fileName);
    renderer.setAttribute(a, SvgAttributes.HREF, imgURI);
    if (a !== undefined) {
      a.dispatchEvent(click);
    }
  }

  exportSvg(anchorSVJ: ElementRef, rendererFactory: RendererFactory2, height: string, width: string) {
    const renderer = rendererFactory.createRenderer(null, null);
    const canvas = renderer.createElement(CANVAS);
    canvas.width = parseInt(width, 10);
    canvas.height = parseInt(height, 10);
    const context = canvas.getContext(CANVAS_CONTEXT);

    const svgData = (new XMLSerializer()).serializeToString(anchorSVJ.nativeElement);
    if (this.exportFileType === SvgTypes.SVG) {
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
      this.triggerDownload(renderer, url, this.exportFileName + PERIOD + this.exportFileType);
    } else {
      const DOMURL = window.URL;
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = DOMURL.createObjectURL(svgBlob);
      img.onload = () => {
        context.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
        const imgURI = (canvas.toDataURL('image/' + this.exportFileType));
        if (this.exportFileType === JPEG) {
          this.exportFileType = JPG;
        }
        this.triggerDownload(renderer, imgURI, this.exportFileName + PERIOD + this.exportFileType);
        renderer.removeChild(canvas, document);
      };
      img.src = url;
    }
  }
}
