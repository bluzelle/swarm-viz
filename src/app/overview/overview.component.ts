import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommunicationService } from '../communication.service';

import { ChartFactory,  ChartMapEntry } from '../../app/chart.factory';


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
      // this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.firstPage, {start: 0.2, end: 3.0});
      // this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.secondPage, {start: 1.0, end: 1.6});
      // this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.summaryPage, {start: 1.8, end: 2.4});
    });
  }

  ngOnInit() {
    this.firstPage.nativeElement.style.opacity = '1.0';
  }





  renderSatelliteEffect(rotation, rotationNew, container: ElementRef, area) {
    const delta = 0.1;
    const start = area.start - delta;
    const end = area.end + delta;

    let factor = -1.0;
    let scaleFactor = 0;
    let opacityFactor = 0.0;
    let factorX = 0.0;
    if (rotation.y > start && rotation.y < area.start) {
      factor = rotationNew.y - area.start;
      factor = Math.round(factor * 10000) / 10000;
      scaleFactor = factor * (- 25);
      scaleFactor = Math.abs(0.1 / scaleFactor);
      if (scaleFactor < 0.05) {
        scaleFactor = 0;
      }
      if (scaleFactor > 0.9) {
        scaleFactor = 0.9;
      }
      opacityFactor = 1.0;
      factorX = (factor *  -3000);
      if (factorX < 15) {
        factorX = 0;
      }
    } else if (rotation.y > area.end && rotation.y < end) {
      factor = (delta - (end - rotationNew.y)) * -1;
      factor = Math.round(factor * 10000) / 10000;
      scaleFactor = 0.9; // (factor * (- 25)) + 1;
      opacityFactor = 1 + factor *  25;
      factorX = 0;
    } else if (rotation.y > area.start && rotation.y < area.end) {
      factor = 0;
    }

    if (factor !== 0) {
      container.nativeElement.style.left =  '' + factorX + 'px';
      container.nativeElement.style.transform = 'scale(' + scaleFactor + ')';
      container.nativeElement.style.opacity = '' + opacityFactor;
    }
    if (factor  === - 1.0) {
      container.nativeElement.style.left =  '0px';
      container.nativeElement.style.transform = 'scale(0.0)';
      container.nativeElement.style.opacity = '0.0';
    }
  }
}



