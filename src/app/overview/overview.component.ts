import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommunicationService } from '../communication.service';

import { ChartFactory,  ChartMapEntry } from '../../chart.factory';


import * as R from 'ramda';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  chartFactory = new ChartFactory();

  @ViewChild('firstPage') firstPage: ElementRef;
  @ViewChild('secondPage') secondPage: ElementRef;
  @ViewChild('summaryPage') summaryPage: ElementRef;




  constructor(private communicationService: CommunicationService) {
    communicationService.change.subscribe(rotation => {
      this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.firstPage, {start: 0.2, end: 0.4});
      this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.secondPage, {start: 0.6, end: 0.8});
      this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.summaryPage, {start: 1.0, end: 1.2});
    });
  }

  ngOnInit() {
  }





  renderSatelliteEffect(rotation, rotationNew, container: ElementRef, area) {
    const delta = 0.1;
    const start = area.start - delta;
    const end = area.end + delta;

    let factor = 0;
    if (rotation.y > start && rotation.y < area.start) {
      factor = rotationNew.y - area.start;
    }
    if (rotation.y > area.end && rotation.y < end) {
      factor = (delta - (end - rotationNew.y)) * -1;
    }
    factor = Math.round(factor * 10000) / 10000;


    if (factor !== 0) {
      const posX = (factor *  -3000);
      container.nativeElement.style.left =  '' + posX + 'px';

      let scale = Math.abs(0.1 / (factor * - 25));
      if (scale > 1.0) {
        scale = 1.0;
      }
      if (scale < 0.05) {
        scale = 0;
      }
      container.nativeElement.style.transform = 'scale(' + scale + ')';
    }
  }
}



