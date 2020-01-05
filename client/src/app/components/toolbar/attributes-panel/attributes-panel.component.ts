/*  Auteur: Équipe 12
    Description: Cette composante gère le panel des attributs.
*/
import { Component, Input} from '@angular/core';
import { Icon } from '../icon';

@Component({
  selector: 'app-attributes-panel',
  templateUrl: './attributes-panel.component.html',
  styleUrls: ['./attributes-panel.component.css'],
})

export class AttributesPanelComponent {
  @Input() icon: Icon;
}
