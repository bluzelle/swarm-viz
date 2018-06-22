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
  private mouseMove = this.onMouseMove.bind(this);
  private mouseUp = this.onMouseUp.bind(this);
  private mouseOut = this.onMouseUp.bind(this);
  private mouseOnDown = { x: 0, y: 0 };
  private targetOnDown = { x: 0, y: 0 };
  private globe = null;
  private globeUtils = new GlobeUtils();


  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('rendererContainer') loading: ElementRef;

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
      this.rotateGlobe(this.globe, this.DEFAULT_MOVEMENT_X, this.DEFAULT_MOVEMENT_Y, this.ROTATE_GLOBE_INTERVAL_MS);
      this.rendererContainer.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    }, 1000);
  }

  rotateGlobe(globe, movementX, movementY, delay) {
    setTimeout(() => {
      const newRotationX = globe.getRotation().x + movementX;
      const newRotationY = globe.getRotation().y + movementY;

      const rotation = this.globeUtils.normalizeRotation({x: newRotationX, y: newRotationY});
      globe.rotate(rotation.x, rotation.y);
      this.rotateGlobe(globe, movementX, movementY, delay);
      this.communicationService.updateGlobeRotation(rotation);
    }, delay);
  }

  private onMouseDown(event) {
      event.preventDefault();

      this.rendererContainer.nativeElement.addEventListener('mousemove', this.mouseMove, false);
      this.rendererContainer.nativeElement.addEventListener('mouseup', this.mouseUp, false);
      this.rendererContainer.nativeElement.addEventListener('mouseout', this.mouseOut, false);

      this.mouseOnDown.x = event.clientX;
      this.mouseOnDown.y = event.clientY;
      this.targetOnDown.x = this.globe.getRotation().x;
      this.targetOnDown.y = this.globe.getRotation().y;

      this.rendererContainer.nativeElement.style.cursor = 'move';
  }

  private onMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const rotY = this.targetOnDown.y + (mouseX - this.mouseOnDown.x) * 0.005;
    const rotX =  this.targetOnDown.x + (mouseY - this.mouseOnDown.y) * 0.0005;

    const rotation = this.globeUtils.normalizeRotation({x: rotX, y: rotY});
    this.globe.rotate(rotation.x, rotation.y);

    this.communicationService.updateGlobeRotation({x: this.globe.getRotation().x, y: this.globe.getRotation().y});
  }

  private onMouseUp(event) {
    this.rendererContainer.nativeElement.removeEventListener('mousemove', this.mouseMove, false);
    this.rendererContainer.nativeElement.removeEventListener('mouseup', this.mouseUp, false);
    this.rendererContainer.nativeElement.removeEventListener('mouseout', this. mouseOut, false);
    this.rendererContainer.nativeElement.style.cursor = 'auto';
  }

  private onMouseOut(event) {
    this.rendererContainer.nativeElement.removeEventListener('mousemove', this.mouseMove, false);
    this.rendererContainer.nativeElement.removeEventListener('mouseup', this.mouseUp, false);
    this.rendererContainer.nativeElement.removeEventListener('mouseout', this. mouseOut, false);
  }
}
