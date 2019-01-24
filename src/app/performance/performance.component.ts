import { Component, OnInit} from '@angular/core';
import { CommunicationService } from '../communication.service';



@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {
  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
  }


}
