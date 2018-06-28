import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobeComponent } from './globe/globe.component';

import { CommunicationService } from './communication.service';
import { GlobeUtils } from './globe/globe.utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private globeUtils = new GlobeUtils();
    private mouseMove = this.onMouseMove.bind(this);
    private mouseUp = this.onMouseUp.bind(this);
    private mouseOut = this.onMouseUp.bind(this);
    private mouseOnDown = { x: 0, y: 0 };
    private targetOnDown = { x: 0, y: 0 };

    @ViewChild('mouseContainer') mouseContainer: ElementRef;
    @ViewChild('globeComponent') globeComponent: GlobeComponent;

    constructor(private communicationService: CommunicationService) {
    }

    ngOnInit() {
        this.mouseContainer.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    }


    private onMouseDown(event) {
        event.preventDefault();

        this.mouseContainer.nativeElement.addEventListener('mousemove', this.mouseMove, false);
        this.mouseContainer.nativeElement.addEventListener('mouseup', this.mouseUp, false);
        this.mouseContainer.nativeElement.addEventListener('mouseout', this.mouseOut, false);

        this.mouseOnDown.x = event.clientX;
        this.mouseOnDown.y = event.clientY;
        this.targetOnDown.x = this.globeComponent.getGlobeRotation().x;
        this.targetOnDown.y = this.globeComponent.getGlobeRotation().y;

        this.mouseContainer.nativeElement.style.cursor = 'move';
    }

    private onMouseMove(event) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const rotY = this.targetOnDown.y + (mouseX - this.mouseOnDown.x) * 0.005;
      const rotX =  this.targetOnDown.x + (mouseY - this.mouseOnDown.y) * 0.0005;

      const rotation = this.globeUtils.normalizeRotation({x: rotX, y: rotY});
      this.globeComponent.setGlobeRotation(rotation);
      this.communicationService.updateGlobeRotation(rotation);
    }

    private onMouseUp(event) {
      this.mouseContainer.nativeElement.removeEventListener('mousemove', this.mouseMove, false);
      this.mouseContainer.nativeElement.removeEventListener('mouseup', this.mouseUp, false);
      this.mouseContainer.nativeElement.removeEventListener('mouseout', this. mouseOut, false);
      this.mouseContainer.nativeElement.style.cursor = 'auto';
    }

    private onMouseOut(event) {
      this.mouseContainer.nativeElement.removeEventListener('mousemove', this.mouseMove, false);
      this.mouseContainer.nativeElement.removeEventListener('mouseup', this.mouseUp, false);
      this.mouseContainer.nativeElement.removeEventListener('mouseout', this. mouseOut, false);
    }
}
