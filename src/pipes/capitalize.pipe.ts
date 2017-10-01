import { Pipe } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe {
    // Autocapitaliza la primera letra de cada palabra
    // Input: {{'john doe' | capitalize}}
    // Output: John Doe
  transform(value) {
  
    if (value) {
      return value.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
    
    return value;
  }
}
