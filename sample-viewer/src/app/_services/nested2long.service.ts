import { Injectable } from '@angular/core';

import { cloneDeep } from 'lodash';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class Nested2longService {

  constructor(private apiSvc: ApiService) {
  }

  // If a key contains an object, will splay out the object
  denestObjects(data) {
    data.forEach(d => {
      let keys = Object.keys(d);

      keys.forEach(key => {
        // For every object (not array of objects), unnest that sucker
        if (d[key] && typeof (d[key]) === "object" && !Array.isArray(d[key])) {
          let nested_cols = Object.keys(d[key]);
          nested_cols.forEach(col => {
            d[col] = d[key][col];
          })
          // remove the nested var.
          delete d[key];
        }
      })
    })
    return (data);
  }

  // (1) flattens arrays
  // (2) calls denestObjects to flatten objects
  nested2long(data, cols2unnest?) {
    let flattened = [];

    data.forEach(d => {
      let keys = Object.keys(d);

      let unnest = cols2unnest ? cols2unnest : keys;

      keys.forEach(key => {
        // For every array of objects, duplicates the row and creates a long dataset.
        if (typeof (d[key]) === "object" && Array.isArray(d[key]) && unnest.includes(key)) {
          d[key].forEach(loc => {
            let entry = cloneDeep(d);
            entry[key] = loc;
            flattened.push(entry);
          })
        }
      })
    })

    // After lengthening the dataset, splay out the object to wide columns.
    flattened = this.denestObjects(flattened);
    console.log(flattened)
    return (flattened)
  }

  prep4download(data, cols2unnest, cols2remove = []) {
    let flattened = this.nested2long(data, cols2unnest);

    flattened = this.apiSvc.dropCols(flattened, cols2remove, false);

    return (flattened);
  }



}