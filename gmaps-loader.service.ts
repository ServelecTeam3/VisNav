import { Injectable } from '@angular/core';  
  
  
const url = "https://maps.google.com/maps/api/js?key=AIzaSyCMiuOp0i2edfIztBqaW6qiCIwXbA_lGoY&callback=gMapsCallback"  
@Injectable()  
export class GoogleMapsLoader {  
  private static promise;  
  public static load() {  
      // First time 'load' is called?  
      if (!GoogleMapsLoader.promise) {  
          // Make promise to load  
          GoogleMapsLoader.promise = new Promise( resolve => {  
              // Set callback for when google maps is loaded.  
              window['gMapsCallback'] = (ev) => {  
                  resolve();  
              };  
  
  
              let node = document.createElement('script');  
              node.src = url;  
              node.type = 'text/javascript';  
              document.getElementsByTagName('head')[0].appendChild(node);  
          });  
      }  
      // Always return promise. When 'load' is called many times, the promise is already resolved.  
      return GoogleMapsLoader.promise;  
  }  
}