
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './components/app/app.component';

import { MatDialogModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import 'hammerjs';
import { ColorPaletteComponent } from './components/color-tools/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-tools/color-picker/color-picker.component';
import { ColorSelectorComponent } from './components/color-tools/color-selector/color-selector.component';
import { CreateDrawingModalComponent } from './components/create-drawing/create-drawing.component';
import { DrawingSurfaceComponent } from './components/drawing-surface/drawing-surface.component';
import { GridComponent } from './components/drawing-surface/grid/grid.component';
import { FeatherComponent } from './components/drawing-tools/feather/feather.component';
import { LineComponent } from './components/drawing-tools/line/line.component';
import { PaintbrushComponent } from './components/drawing-tools/paintbrush/paintbrush.component';
import { PenComponent } from './components/drawing-tools/pen/pen.component';
import { PencilComponent } from './components/drawing-tools/pencil/pencil.component';
import { SprayPaintComponent } from './components/drawing-tools/spray-paint/spray-paint.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import {ModalWindowComponent, ModalWindowContentComponent} from './components/modal-window/modal-window.component';
import { OpenDrawingComponent } from './components/open-drawing/open-drawing.component';
import { SanitizeHtmlPipe } from './components/open-drawing/sanitizeHtml.pipe';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { EllipseComponent } from './components/shape-tools/ellipse/ellipse.component';
import { PolygonComponent } from './components/shape-tools/polygon/polygon.component';
import { RectangleComponent } from './components/shape-tools/rectangle/rectangle.component';
import { StampComponent } from './components/stamp/stamp.component';
import { TextComponent } from './components/text/text.component';
import { DrawingToolAttributesComponent } from './components/toolbar/attributes-drawing-tool/attributes-drawing-tool.component';
import { AttributesEraserComponent } from './components/toolbar/attributes-eraser/attributes-eraser.component';
import { AttributesPaintBucketComponent } from './components/toolbar/attributes-paint-bucket/attributes-paint-bucket.component';
import { AttributesPanelComponent } from './components/toolbar/attributes-panel/attributes-panel.component';
import { AttributesSelectComponent } from './components/toolbar/attributes-select/attributes-select.component';
import { ShapeAttributesComponent } from './components/toolbar/attributes-shapes/attributes-shapes.component';
import { AttributesStampComponent } from './components/toolbar/attributes-stamp/attributes-stamp.component';
import { AttributesTextComponent } from './components/toolbar/attributes-text/attributes-text.component';
import { GridOptionsComponent } from './components/toolbar/grid-options/grid-options.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { ClipboardService } from './services/clipboard/clipboard.service';
import { DrawingService } from './services/drawing/drawing.service';
import { EraserService } from './services/eraser/eraser.service';
import { FormService } from './services/form/form.service';
import { IconService } from './services/Icon/icon.service';
import { SaveService } from './services/save/save.service';
import { SelectionService } from './services/selection/selection.service';
import { ShortcutsService } from './services/shortcuts/shortcuts.service';
import { TestingImportsModule } from './testing-imports/testing-imports';

@NgModule({
  declarations: [
    RectangleComponent,
    AppComponent,
    AttributesPanelComponent,
    DrawingSurfaceComponent,
    ToolbarComponent,
    CreateDrawingModalComponent,
    ColorPaletteComponent,
    ColorPickerComponent,
    ColorSelectorComponent,
    ModalWindowComponent,
    ModalWindowContentComponent,
    UserGuideComponent,
    ShapeAttributesComponent,
    DrawingToolAttributesComponent,
    PencilComponent,
    PaintbrushComponent,
    EllipseComponent,
    LineComponent,
    StampComponent,
    PolygonComponent,
    GridComponent,
    GridOptionsComponent,
    SaveDrawingComponent,
    OpenDrawingComponent,
    SanitizeHtmlPipe,
    TextComponent,
    PenComponent,
    AttributesStampComponent,
    AttributesSelectComponent,
    AttributesTextComponent,
    AttributesEraserComponent,
    ExportDrawingComponent,
    SprayPaintComponent,
    FeatherComponent,
    AttributesPaintBucketComponent,

  ],
  imports: [
    TestingImportsModule,
    BrowserModule,
    MatDialogModule,
    MatIconModule,
  ],

  entryComponents: [
    ModalWindowComponent,
    ModalWindowContentComponent,
    ColorPickerComponent,
  ],

  providers: [FormService, IconService, ShortcutsService, SelectionService, SaveService, DrawingService, EraserService, ClipboardService],
  bootstrap: [AppComponent],
})

export class AppModule {}
