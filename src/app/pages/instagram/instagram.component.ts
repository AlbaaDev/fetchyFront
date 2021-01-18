import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as d3 from 'd3';
import { DSVRowArray } from 'd3';
import { HttpClient } from '@angular/common/http';
export type DataType = {date: any, close: any};

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {
  searchForm: FormGroup;
  private svg: any;
  private margin: any;
  private width: any;
  private height: any;
  private parseTime: any;
  private dateFormat: any;
  private xScale: any;
  private yScale: any;
  private map: any;
  private toolTip: any;
  private verticalLine: any;
  private entry: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.searchForm = this.formBuilder.group({search : ['', [Validators.required]]});
  }
  ngOnInit(): void {
    this.buildSvg();
    this.setTimeFormat();
    this.buildChart();
    this.mouseOver();
    this.getStockData();
  }
  onSubmit() {
    return true;
  }
  private buildSvg() {
    this.margin  =  {top: 20, right: 30, bottom: 30, left: 60};
    this.width   =  document.getElementById('container').offsetWidth * 0.95 - this.margin.left - this.margin.right,
    this.height  =  400 - this.margin.top - this.margin.bottom;
    this.svg     =  d3.select('#container')
                      .append('svg')
                      .attr('id', 'svg')
                      .attr('style', 'border: 1px solid black')
                      .attr('width',  this.width + this.margin.left + this.margin.right)
                      .attr('height', this.height + this.margin.top + this.margin.bottom)
                      .append('g')
                      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private setTimeFormat() {
    this.parseTime = d3.timeParse('%d/%m/%Y');
    this.dateFormat = d3.timeFormat('%d/%m/%Y');
  }
  private buildChart() {
    this.map = {};
    d3.csv('assets/stocks.csv').then((data) =>
      {
        data.forEach((d: any) => {
          d.date = this.parseTime(d.date);
          d.close = +d.close;
          d.volume = +d.volume;
          this.map[d.date] = d;
        });
        this.scalingAxis(data);
        this.addAxis();
        this.traceTicksLines();
        this.drawDataLine(data);
      });
  }
  private scalingAxis(data: DSVRowArray<string>) {
    this.xScale = d3.scaleTime().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);
    this.xScale.domain(d3.extent(data, d => d.date));
    this.yScale.domain(d3.extent(data, d => d.close));
  }
  private addAxis() {
    this.svg.append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScale));
    this.svg.append('g')
            .call(d3.axisLeft(this.yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .style('text-anchor', 'end')
            .text('Pts');
  }
  private traceTicksLines() {
    this.svg.selectAll('y axis')
            .data(this.yScale.ticks(10))
            .enter()
            .append('line')
            .attr('class', 'horizontalGrid')
            .attr('x1', 0)
            .attr('x2', this.width)
            .attr('y1', d => this.yScale(d))
            .attr('y2', d => this.yScale(d))
            .attr('stroke', 'gray');
  }
  private drawDataLine(data: DSVRowArray<string>) {
    const line = d3.line<DataType>()
                   .x((d) => this.xScale(d.date))
                   .y((d) => this.yScale(d.close));
    this.svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', 'blue');
  }
  // private createVerticalLine() {

  // }
  private mouseOver() {
    // this.createToolTip();
    // this.createVerticalLine();
    d3.select('#container').on('mousemove', () => {
      let mouse_x = d3.mouse(d3.event.target)[0];
      let mouse_y = d3.mouse(d3.event.target)[1];
      if (mouse_x < this.margin.left || mouse_x > (this.width + this.margin.left)
          || mouse_y < this.margin.top || mouse_y > (400 - this.margin.bottom)) {
        return;
      }
      // this.addToolTip();
    }).on('mouseout', () => {
      let mouse_x = d3.mouse(d3.event.target)[0];
      let mouse_y = d3.mouse(d3.event.target)[1];
      if (mouse_x < this.margin.left || mouse_x > (this.width + this.margin.left)
        || mouse_y < this.margin.top || mouse_y > (400 - this.margin.bottom)) {
          // this.toolTip.style('opacity', 0);
          // this.verticalLine.style('opacity', 0);
      }
  });
  }
  private drawVerticalLine(mouse_x: number) {
    const selectedDate = this.xScale.invert(mouse_x - this.margin.left);
    this.verticalLine.attr('x1', mouse_x - this.margin.left);
    this.verticalLine.attr('x2', mouse_x - this.margin.left);
    this.verticalLine.style('opacity', 0.3);
    selectedDate.setHours(0, 0, 0, 0);
    this.entry = this.map[selectedDate];
    if (typeof this.entry === 'undefined') {
        return ;
    }
  }
  private getStockData() {
    return this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
                    .subscribe((data: any) => console.log(data));
  }
}
