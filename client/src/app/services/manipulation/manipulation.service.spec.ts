/*tslint:disable*/
import { TestBed } from '@angular/core/testing';

import { ManipulationService } from './manipulation.service';
import { GridService } from '../grid/grid.service';
import { Component, Renderer2, ElementRef, RendererFactory2, Renderer } from '@angular/core';
import { SelectionService } from '../selection/selection.service';

@Component({
  template: `<SVG></SVG>`,
})
class MockSVGComponent {
}
class MockSVGElement {
}
class MockSVGAElement {
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  getAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  getBoundingClientRect(element:any){
    return true;
  }
}
class MockSVGGraphicsElement {
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  getAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  getBoundingClientRect(element:any){
    return true;
  }
}
class MockRendererFactory {
  createRenderer(renderer: any, element: any) {
    return new MockRenderer();
  }
}
class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any , child: any) {
    return ;
  }
  removeChild(elementRef: any, child: any) {
    return true;
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  createElement(element: any, element2: any) {
    return true;
  }
}
describe('ManipulationService', () => {
  let service: ManipulationService;
  let renderer: Renderer2;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: SVGElement, useClass: MockSVGElement},{provide: SVGAElement, useClass: MockSVGAElement}, {provide: ElementRef, useClass: MockSVGComponent}, SelectionService, {provide: SVGGraphicsElement, useClass: MockSVGGraphicsElement}, {provide: ElementRef, useClass: MockSVGComponent},
        {provide: Renderer2, useClass: MockRenderer}, {provide: RendererFactory2, useClass : MockRendererFactory}, GridService],
    });
    service = TestBed.get(ManipulationService);
  });

  it('should be created', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    expect(service).toBeTruthy();
  });

  it('should calculateAmountTranslated', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const gridService= new GridService();
    service['x1']=1;
    service['y1']=1;
    const x2:number=10;
    const y2:number=10;
    service['calculateAmountTranslated'](x2,y2);
    expect(service['properties'].amountTranslatedX).toEqual(x2-service['x1']);
    expect(service['properties'].amountTranslatedY).toEqual(y2-service['y1']);
  });

  it('should setToolbarWidth', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const gridService= new GridService();
    const width:number=10;
    service.setToolbarWidth(width);
    expect(service['properties'].toolbarWidth).toEqual(width);
  });

  it('should setAmountScrolled', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const gridService= new GridService();
    const scrollX:number=10;
    const scrollY:number=10;
    service.setAmountScrolled(scrollX,scrollY);
    expect(service['properties'].amountScrolledX).toEqual(scrollX);
    expect(service['properties'].amountScrolledY).toEqual(scrollY);
  });

  it('should initializeArrayForRotate', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const gridService= new GridService();
    service['initializeArrayForRotate']();
    expect(service['properties'].enteredOnce).toEqual([]);
    expect(service['properties'].elementCenterX).toEqual([]);
    expect(service['properties'].elementCenterY).toEqual([]);
  });

  it('should allignWithGrid', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    renderer=TestBed.get(Renderer2);
    let selectedElements:SVGGraphicsElement[]=[];
    const gridService= new GridService();
    service.x1SelectedBox =5;
    service.y1SelectedBox = 5;
    service['properties'].amountTranslatedX = 5;
    service['properties'].amountTranslatedY = 5;
    service['gridService'].squareSize =10;
    spyOn<any>(service,'findNewCoordinatesMag');
    spyOn<any>(service,'updateInitialCoordinates');
    service.allignWithGrid(selectedElements,renderer);
    expect(service['index']).toEqual(0);
  });

  it('should findNewCoordinatesMag', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    renderer=TestBed.get(Renderer2);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes)

    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    const gridService= new GridService();
    spyOn<any>(service,'findTransformAttributeOfElement');
    const spy=spyOn(renderer,'setAttribute').and.callThrough();
    service['findNewCoordinatesMag'](selectedElements,1,1,renderer);
    expect(spy).toHaveBeenCalled();
  });

  it('should translate', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    renderer=TestBed.get(Renderer2);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    const gridService= new GridService();
    spyOn<any>(service,'findTransformAttributeOfElement').and.callThrough();
    const spy=spyOn(renderer,'setAttribute').and.callThrough();
    service.translate(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should updateInitialCoordinates', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    renderer=TestBed.get(Renderer2);
    const selectedElements:SVGGraphicsElement[]=[];
    const gridService= new GridService();
    spyOn<any>(service,'initializeArrayForRotate').and.callThrough();
    service.updateInitialCoordinates(selectedElements);
    expect(service['initialTranslateCoordinates']).toEqual([]);
    expect(service['initialTransformStringArray']).toEqual([]);
  });

  it('should findCenterBox', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const box:SVGGraphicsElement= TestBed.get(SVGGraphicsElement);
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service.findCenterBox(box);
    expect(service['properties'].boxX).toEqual(Number(box.getAttribute('x')));
    expect(service['properties'].boxY).toEqual(Number(box.getAttribute('y')));
    expect(service['properties'].boxHeight).toEqual(Number(box.getAttribute('height')));
    expect(service['properties'].boxWidth).toEqual(Number(box.getAttribute('width')));
    expect(service['properties'].boxCenterX).toEqual((service['properties'].boxX) + (service['properties'].boxWidth / 2));
    expect(service['properties'].boxCenterY).toEqual((service['properties'].boxY) + (service['properties'].boxHeight / 2));
  });

  it('should findCenterElement', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const child:SVGAElement= TestBed.get(SVGAElement);
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service.findCenterElement(child);
    expect(service['properties'].elementX).toEqual(Number(child.getBoundingClientRect().left) - service['properties'].toolbarWidth
    + service['properties'].amountScrolledX - 5);
    expect(service['properties'].elementY).toEqual(Number(child.getBoundingClientRect().top) + service['properties'].amountScrolledY - 5);
    expect(service['properties'].elementHeight).toEqual(Number(child.getBoundingClientRect().height));
    expect(service['properties'].elementWidth).toEqual(Number(child.getBoundingClientRect().width));
  });

  it('should findTransformAttributeOfElement', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const index:number= 1;
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['initialTransformStringArray'][index]='12';
    spyOn<any>(service,'findRotateAttributes');
    spyOn<any>(service,'findTranslateAttributes');
    service['findTransformAttributeOfElement'](index);
    expect(service['properties'].initTransform).toEqual('12');
  });

  it('should findTranslateAttributes', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const index:number= 1;
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['initialTranslateCoordinates']=[];
    service['findTranslateAttributes'](index);
    expect(service['properties'].initTransform).toEqual(" ");
    expect(service['properties'].initRotate).toEqual(" ");
    expect(service['properties'].initTranslate).toEqual(" ");
  });

  it('should addTransformElement', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const child:SVGAElement= TestBed.get(SVGAElement);
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['properties'].initTransform='(1s234)';
    const spy=spyOn<any>(child,'setAttribute');
    service['addTransformElement'](child,1,1,1);
    expect(service['properties'].angleOfElement).toEqual(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should rotateByBox', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const selectedElements:SVGGraphicsElement[]=[];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['properties'].initTransform='(1s234)';
    spyOn<any>(service,'initializeArrayForRotate');
    service.rotateByBox(selectedElements,1);
    expect(service['index']).toEqual(0);
  });

  it('should rotateByElement', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const selectedElements:SVGGraphicsElement[]=[];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['properties'].initTransform='(1s234)';
    spyOn<any>(service,'initializeArrayForRotate');
    service.rotateByElement(selectedElements,1);
    expect(service['index']).toEqual(0);
  });

  it('should keyShift', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const keyShift:boolean=true;
    renderer=TestBed.get(Renderer2);
    service.keyShift(keyShift);
    expect(service['keyShiftOn']).toEqual(keyShift);
  });

  it('should keyAlt', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    const keyAlt:boolean=true;
    renderer=TestBed.get(Renderer2);
    service.keyAlt(keyAlt);
    expect(service['keyAltOn']).toEqual(keyAlt);
  });


  it('should resizeDiagonal if translate', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service['isLeftControl'] = true;
    service['isTopControl']= true;
    service.initialTransformStringArray[0] ='translate(5,5)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeDiagonal(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });

  it('should resizeDiagonal if scale negative', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service.initialTransformStringArray[0] ='translate(5,5)scale(-1,-1)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeDiagonal(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });
  
  it('should resizeDiagonal if rotate', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service.initialTransformStringArray[0] ='translate(5,5)rotate(1,1)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeDiagonal(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });

  it('should resizeVertical if translate', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service.initialTransformStringArray[0] ='translate(5,5)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeVertical(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });
  it('should resizeVertical if scale negative', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service['isLeftControl'] = true;
    service['isTopControl']= true;
    service.initialTransformStringArray[0] ='translate(5,5)scale(-1,-1)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeVertical(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });
  it('should resizeVertical if rotate', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service.initialTransformStringArray[0] ='translate(5,5)rotate(1,1)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeVertical(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });

  it('should resizeHorizontal if scale negative', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service['isLeftControl'] = true;
    service['isTopControl']= true;
    service.initialTransformStringArray[0] ='translate(5,5)scale(-1,-1)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeHorizontal(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });
  
  it('should resizeHorizontal', () => {
    const service: ManipulationService = TestBed.get(ManipulationService);
    let transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    service.initialRotateCoordinates.push(transformAttributes);
    let element: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let parent: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    parent.appendChild(element);
    const selectedElements:SVGGraphicsElement[]=[parent];
    renderer=TestBed.get(Renderer2);
    const gridService= new GridService();
    service['keyAltOn']=true;
    service['properties'].amountTranslatedX=1;
    service['properties'].amountTranslatedY=10;
    service['index'] = 0
    service.initialTransformStringArray[0] ='translate(5,5)rotate(1,1)'
    spyOn<any>(service,'calculateAmountTranslated');
    service.resizeHorizontal(renderer,selectedElements,1,1);
    expect(service['index']).toEqual(1);
  });

  it('should find translate coordinates', ()=>{
    const transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    const expectedvalue = {
      x:0,
      y:0
    }
    expect(service['findTranslateCoordinates'](service.initialTranslateCoordinates)).toEqual(expectedvalue);

  })
  it('should find rotate coordinates', ()=>{
    const transformAttributes = {
      x:5,
      y:5
    }
    service.initialTransformStringArray.push('');
    service.initialTranslateCoordinates.push(transformAttributes);
    const expectedvalue = {
      x:0,
      y:0,
      rotate:0
    }
    expect(service['findRotateCoordinates'](service.initialTranslateCoordinates)).toEqual(expectedvalue);

  })
  it('should parseTransform for translate', ()=>{
    let expectedvalue:any = []
    const transformAttributes = {
      name:'translate',
      x:5,
      y:5,
      rotate:0,
    }
    expectedvalue.push(transformAttributes);
    service.initialTransformStringArray.push('');
   
    expect(service['parseTransform']("translate(5,5)")).toEqual(expectedvalue);

  })
  it('should parseTransform for rotate', ()=>{
    let expectedvalue:any = []
    const transformAttributes = {
      name:'rotate',
      x:5,
      y:5,
      rotate:0,
    }
    expectedvalue.push(transformAttributes);
    service.initialTransformStringArray.push('');
   
    expect(service['parseTransform']("rotate(0,5,5)")).toEqual(expectedvalue);

  })
  it('should convertTransformToString for translate', ()=>{
    let transformAttributesArray:any = []
    const transformAttributes = {
      name:'translate',
      x:5,
      y:5,
      rotate:0,
    }
    transformAttributesArray.push(transformAttributes);
    service.initialTransformStringArray.push('');
   
    expect(service['convertTransformToString'](transformAttributesArray)).toEqual('translate(5,5)');

  })

  it('should convertTransformToString for rotate', ()=>{
    let transformAttributesArray:any = []
    const transformAttributes = {
      name:'rotate',
      x:5,
      y:5,
      rotate:0,
    }
    transformAttributesArray.push(transformAttributes);
    service.initialTransformStringArray.push('');
   
    expect(service['convertTransformToString'](transformAttributesArray)).toEqual('rotate(0,5,5)');

  })
});
