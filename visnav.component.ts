/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { } from '@types/googlemaps';
import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { GoogleMapsLoader } from './gmaps-loader.service'
//declare var google: any;

@Component({
  selector: 'visnav',
  templateUrl: 'visnav.component.html',
  styleUrls: ['visnav.component.css']
})
export class VisnavComponent implements OnInit, OnChanges {
  @Input() fgColor: string;
  @Input() bkColor: string;
  @Input() data: any;
  @Input() pathPrefix: string;
  values: any[];
  markers: google.maps.Marker[] = [];
  showDiv: boolean = false;
  divData:string[] = ["Test"];
  zoom;

  @ViewChild('gmap') gmapElement: any;
  private map: google.maps.Map


  constructor(private mapLoader: GoogleMapsLoader) {


  }

  ngOnInit(): void {

    GoogleMapsLoader.load().then(res => {
      console.log('GoogleMapsLoader.load.then', res);
      this.initMap();
    });

    /*const url = "https://maps.google.com/maps/api/js?key=AIzaSyCMiuOp0i2edfIztBqaW6qiCIwXbA_lGoY"  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);  
  
    this.initMap(); */
  }
  ngOnChanges(changes) {
    if (changes.data) {
      this.values = this.formatData(changes.data.currentValue.body);
      if(this.map){
      console.log("Zoom is : " + this.map.getZoom())
      }
      this.bindDataToZoom();
      
    }
  }

  private initMap() {
    var mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    var aMarker = new google.maps.Marker({
      position: new google.maps.LatLng(18.575, 73.8132),
      draggable: false,
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 4,
        fillColor: "green"
      }
    });

    aMarker.addListener('click', () => {
      this.showDiv = !this.showDiv
      console.log(this.showDiv)
    });

    this.map.addListener('zoom_changed', () => {
      console.log("Zoom is : " + this.map.getZoom())
      this.bindDataToZoom();
      console.log("zoom listening");
    });

  }

  bindDataToZoom() {
    if (this.values) {
      if (this.map) {

        this.values.forEach((value) => {
          value.forEach((marker) => {
            marker.setVisible(false);
          })
        });

        for (let i = 0; i < this.values.length; i++) {
          if (this.map.getZoom() < 6) {
            this.values[i].forEach((marker) => {
              marker.setVisible(true)

            })
          } else if (this.map.getZoom() < 15) {
            this.values[i].forEach((marker) => {
              
              marker.setVisible(true)

            })
          } else {
            this.values[i].forEach((marker) => {
              marker.setVisible(true)
            })
          }
        }
      }
    }
  }

  findRelatedAttributes(data, element: string) {
    var elementObj: any = {};

    for (let i = 0; i < data.length; i++) {
      if (data[i].path.split("|")[0] == element) {
        elementObj[data[i].path.split("|")[1]] = data[i].value;
        //Creates a property with the name of an attribute, and assigns the value to be the value of that attribute
      }
    }
    return elementObj;
  }

  mapDataToObjects(data) {
    var coordinates: any[] = [];
    var element: string;
    for (let i = 0; i < data.length; i++) {
      element = data[i].path.split("|")[0]; //Sets the "Element" To be equal
      coordinates.push(this.findRelatedAttributes(data, element));
    }

    return coordinates;
  }

  findMaxLevel(data) {
    //This function is created so that an array of each level can be created

    var level: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].path.split("|")[1] == "Level") {//If that attribute is named level
        level.push(data[i].value); //push it's value to an array of all the levels iterated over
      }
    }
    return level.reduce((p, c) => (p > c) ? p : c); //Return the maximum value for levels 
  }

  formatData(data) {
    if (this.isDataValid()) {
      var setOfMarkers: google.maps.Marker[][] = [];
      setOfMarkers.length = this.findMaxLevel(data) + 1;
      setOfMarkers.fill(new Array<google.maps.Marker>());
      var coordinates = this.mapDataToObjects(data);

      for (let i = 0; i < coordinates.length; i++) {
        for (let j = 0; j < setOfMarkers.length; j++) {
          if (coordinates[i].Level == j) {
            var aMarker: google.maps.Marker = new google.maps.Marker({
              position: new google.maps.LatLng(coordinates[i].Latitude, coordinates[i].Longitude),
              draggable: false,
              map: this.map,
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 4,
                fillColor: "green"
              },
              visible: false

            });

            aMarker.addListener('click', () => {
              this.showDiv = !this.showDiv
              this.divData = [];
              for(let key in coordinates[i]){
                  this.divData.push(key + " : " + coordinates[i][key]);
              } 
              console.log(this.showDiv)
            });

            setOfMarkers[j].push(aMarker);
          }
        }

      }

    }

    return setOfMarkers;

  }

  private isDataValid(): boolean {
    return this.data && this.data.body && this.data.body.length;
  }

  /*private formatValue(value: any) {
    // very basic enumeration support
    if (value.Name) {
      return value.Name;
    }

    return value;
  }

  private formatInfo() {
    let output = '';
    this.data.body.forEach(item => {
      output += item.path + '\n';
      output += item.timestamp + '\n';
      output += item.type + '\n';
      output += (item.good ? 'good' : 'bad') + ' data\n------------\n';
    });

    return output;*/
  //}

}
