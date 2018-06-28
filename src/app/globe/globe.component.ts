import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { Globe } from './globe';
import { GlobeUtils } from './globe.utils';


@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})

export class GlobeComponent implements OnInit {
  private ROTATE_GLOBE_INTERVAL_MS = 20;
  private DEFAULT_MOVEMENT_Y = 0.002;
  private DEFAULT_MOVEMENT_X = 0.0;

  private globe = null;
  private globeUtils = new GlobeUtils();


  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  imgDir = '../../img/world.jpg';

  constructor(private communicationService: CommunicationService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const MIN_POPULATION_FILTER = 0.003;


    this.globe = new Globe(this.rendererContainer.nativeElement, {
      imgDir: this.imgDir
    });


    const self = this;
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '../../assets/population.json', true);
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            JSON.parse(xhr.responseText).reduce((a, b) => {
              if (a instanceof Array && a[a.length - 1].length < 3) {
                a[a.length - 1].push(b);
                return a;
              } else {
                  return a.concat([[b]]);
              }
            }, [[]]).filter((v) => v[2] > MIN_POPULATION_FILTER).forEach((v) => {
              self.globe.addPoint(v[0], v[1], v[2]);
            });
            self.globe.renderPoints();
          }
        }
      };
      xhr.send(null);
      self.rotateGlobe(self.DEFAULT_MOVEMENT_X, self.DEFAULT_MOVEMENT_Y, self.ROTATE_GLOBE_INTERVAL_MS);
    }, 1000);
  }

  rotateGlobe(movementX, movementY, delay) {
    setTimeout(() => {
      const newRotationX = this.globe.getRotation().x + movementX;
      const newRotationY = this.globe.getRotation().y + movementY;

      const rotation = this.globeUtils.normalizeRotation({x: newRotationX, y: newRotationY});
      this.setGlobeRotation(rotation);
      this.rotateGlobe(movementX, movementY, delay);
      this.communicationService.updateGlobeRotation(rotation);
    }, delay);
  }

  setGlobeRotation(rotation) {
    this.globe.rotate(rotation.x, rotation.y);
  }

  getGlobeRotation() {
    return this.globe.getRotation();
  }


}
