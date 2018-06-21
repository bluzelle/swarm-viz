import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Globe } from './globe';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})

export class GlobeComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('rendererContainer') loading: ElementRef;

  imgDir = '../../img/world.jpg';

  constructor() {
  }

  ngAfterViewInit() {
    const globe = new Globe(this.rendererContainer.nativeElement, {
      imgDir: this.imgDir
    });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../../assets/population_small.json', true);
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          JSON.parse(xhr.responseText).reduce((a, b) =>{
            if (a instanceof Array && a[a.length - 1].length < 3) {
              a[a.length - 1].push(b);
              return a;
            } else {
                return a.concat([[b]]);
            }
          }, [[]]).forEach((v) => {
            globe.addPoint(v[0], v[1], v[2]);
          });

        }
      }
    };
    xhr.send(null);
  }



  ngOnInit() {
  }
}
