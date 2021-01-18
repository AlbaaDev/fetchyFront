import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { svg } from 'd3';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
  searchForm: FormGroup;
  private salesData: any;
  private svg: any;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private padding: any;
  private chartArea: any;
  private rectGrp: any;
  private url = 'assets/data.csv';

  constructor(private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({search : ['', [Validators.required]]});
  }
  ngOnInit(): void {
    this.buildSvg();
    this.loadData();
  }
  onSubmit() {
    return true;
  }
  private buildSvg() {
    this.svg = d3.select('#svg1');
    this.padding = {top: 20, bottom: 30, left: 50, right: 30};
    this.chartArea = { width : parseInt(this.svg.style('width'), 10) - this.padding.left - this.padding.right,
                       height : parseInt(this.svg.style('height'), 10) - this.padding.top - this.padding.bottom
                     };
  }
  private loadData() {
    d3.csv('assets/data.csv').then((data) => {
      this.salesData = data;
      this.scalingAxis();
      this.adjustChart();
      this.fillChartWithData();
    });
  }
  private scalingAxis() {
    this.xScale = d3.scaleBand()
                    .domain(this.salesData.map((row) => row.year))
                    .range([0, this.chartArea.width])
                    .padding(.2);
    this.yScale = d3.scaleLinear()
                    .domain([0, d3.max(this.salesData, (d: any) => parseInt(d.value, 10) )])
                    .range([this.chartArea.height, 0])
                    .nice();
  }
  private adjustChart() {
    this.xAxis = this.svg.append('g')
        .attr('transform', 'translate(' + this.padding.left + ',' + (this.chartArea.height + this.padding.top) + ')')
        .call(d3.axisBottom(this.xScale));
    this.yAxis = this.svg.append('g')
        .attr('transform', 'translate(' + this.padding.left + ',' + this.padding.top + ')')
        .call(d3.axisLeft(this.yScale));
    this.rectGrp = this.svg.append('g')
                           .attr('transform', 'translate(' + this.padding.left + ', ' + this.padding.top + ')');
  }
  private fillChartWithData() {
      this.rectGrp.selectAll('.bar')
              .data(this.salesData)
              .enter().append('rect')
              .attr('class', 'bar')
              .attr('x', (d) =>  this.xScale(d.year))
              .attr('y', (d) =>  this.yScale(d.value))
              .attr('width', () => this.xScale.bandwidth())
              .attr('height', (d) => this.chartArea.height - this.yScale(d.value))
              .attr('fill', 'steelblue') ;
  }

}
