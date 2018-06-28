import { Injectable, Output, EventEmitter } from '@angular/core';
import * as bluzelle from 'bluzelle';
import * as R from 'ramda';

import { StateUtils } from './stateUtils';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  TIMEOUT = 1000;
  NUMBER_ENTRIES_CACHE = 15;
  NODE_EMULATOR_WS = 'ws://127.0.0.1:8100';

  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() stateChange: EventEmitter<any> = new EventEmitter();

  private globeRotation = {x: 0.0, y: 0.0};
  private state = {};



  constructor() {

    const initialStates = R.map((a) => {
      return {
        transactionLatency: 0
      };
    }, R.range(0, this.NUMBER_ENTRIES_CACHE));
    bluzelle.connect(this.NODE_EMULATOR_WS, '');
    this.poll(initialStates, this.TIMEOUT);
  }

  private poll(states, timeout) {
    const last = Date.now();
    const stateHandling = (state) => {
      state.transactionLatency = (Date.now() - last) - timeout;
      const newStates = new StateUtils().updateStates(states, state);
      this.updateState(newStates, state);
      this.poll(newStates, timeout);
    };
    setTimeout(() => { bluzelle.state().then(stateHandling.bind(this)); }, timeout);
  }

  updateGlobeRotation(rotation) {
    this.change.emit({rotation: this.globeRotation, newRotation: rotation});
    this.globeRotation = rotation;
  }

  updateState(states, state) {
    this.stateChange.emit({states: states, state: state});
    this.state = state;
  }

}
