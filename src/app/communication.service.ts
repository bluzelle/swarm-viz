import { Injectable, Output, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  private globeRotation = 0.0;


  constructor() {}

  updateGlobeRotation(rotation) {
    this.globeRotation = rotation;
    this.change.emit(rotation);
  }

}
