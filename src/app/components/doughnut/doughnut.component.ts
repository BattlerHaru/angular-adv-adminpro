import { Component, Input, } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styles: [
  ]
})
export class DoughnutComponent {

  @Input() title: string = 'Sin titulo';

  @Input('labels') doughnutChartLabels: Label[] = ['Label1', 'Label2', 'Label3'];
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];
  public doughnutChartType: ChartType = 'doughnut';

  public colors: Color[] = [
    // Se necesita el mismo numero de colores que el arreglo data
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059'] }
  ];
}
