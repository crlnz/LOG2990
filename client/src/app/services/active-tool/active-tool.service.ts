/*
  Auteur: Équipe 12
  Description: Ce service permet de créer un lien entre les différentes composantes et les événements de la souris
 */
/* tslint:disable:no-empty */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ActiveToolService {
  mouseDown(event: MouseEvent) {}

  mouseMove(event: MouseEvent) {}

  mouseUp(event: MouseEvent) {}

  doubleClick(event: MouseEvent) {}
}
