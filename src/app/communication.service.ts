import { Injectable, Output, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  @Output() change: EventEmitter<any> = new EventEmitter();

  private globeRotation = {x: 0.0, y: 0.0};


  constructor() {}

  updateGlobeRotation(rotation) {
    this.change.emit({rotation: this.globeRotation, newRotation: rotation});
    this.globeRotation = rotation;
  }

}
