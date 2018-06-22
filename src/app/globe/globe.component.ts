import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { Globe } from './globe';


@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})

export class GlobeComponent implements OnInit {
  private ROTATE_GLOBE_INTERVAL_MS = 20;
  private DEFAULT_MOVEMENT_Y = 0.002;
  private DEFAULT_MOVEMENT_X = 0.0;

  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('rendererContainer') loading: ElementRef;

  imgDir = '../../img/world.jpg';

  constructor(private communicationService: CommunicationService) {
  }

  ngAfterViewInit() {
    const MIN_POPULATION_FILTER = 0.003;


    const globe = new Globe(this.rendererContainer.nativeElement, {
      imgDir: this.imgDir
    });


    setTimeout(( ) => {
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
              globe.addPoint(v[0], v[1], v[2]);
            });
            globe.renderPoints();
          }
        }
      };
      xhr.send(null);
      this.rotateGlobe(globe, this.DEFAULT_MOVEMENT_X, this.DEFAULT_MOVEMENT_Y, this.ROTATE_GLOBE_INTERVAL_MS);
    }, 1000);
  }

  rotateGlobe(globe, movementX, movementY, delay) {
    setTimeout(() => {
      const newRotationX = globe.getRotation().x + movementX;
      const newRotationY = globe.getRotation().y + movementY;
      globe.rotate(newRotationX, newRotationY);
      this.rotateGlobe(globe, movementX, movementY, delay);
      this.communicationService.updateGlobeRotation({x: newRotationX, y: newRotationY});
    }, delay);
  }



  ngOnInit() {
  }
}
