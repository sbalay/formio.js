import { BaseComponent } from '../base/Base';
import Choices from 'choices.js';
import Formio from '../../formio';
import _each from 'lodash/each';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';

export class BaseWithDatasourceComponent extends BaseComponent {

  loadItems(url, input, headers, options) {
    let query = {
      limit: 100,
      skip: 0
    };

    // Allow for url interpolation.
    url = this.interpolate(url, {
      data: this.data,
      formioBase: Formio.getBaseUrl()
    });

    // Add search capability.
    if (this.component.searchField && input) {
      query[this.component.searchField] = input;
    }

    // Add filter capability
    if (this.component.filter) {
      let filter = this.interpolate(this.component.filter, {data: this.data});
      url += ((url.indexOf('?') === -1) ? '?' : '&') + filter;
    }

    // If they wish to return only some fields.
    if (this.component.selectFields) {
      query.select = this.component.selectFields;
    }

    // Add the query string.
    url += '?' + Formio.serialize(query);

    // Make the request.
    return Formio.request(url, null, null, headers, options);
  }

  updateItems(container) {
    switch(this.component.dataSrc) {
      case 'values':
        this.component.valueProperty = 'value';
        this.setItems(this.component.data.values, container);
        break;
      case 'json':
        try {
          this.setItems(JSON.parse(this.component.data.json), container);
        }
        catch (error) {
          console.log(error);
        }
        break;
      case 'resource':
        this.loadItems(Formio.getAppUrl() + '/form/' + this.component.data.resource + '/submission')
          .then((response) => this.setItems(response, container));
        break;
      case 'url':
        this.loadItems(this.component.data.url, null, new Headers(), {
          noToken: true
        }).then((response) => this.setItems(response, container));
        break;
    }
  }

  itemValue(data) {
    return this.component.valueProperty ? _get(data, this.component.valueProperty) : data;
  }

  itemLabel(data) {
    return this.component.labelProperty ? _get(data, this.component.labelProperty) : data;
  }

  itemTemplate(data) {
    return this.component.template ? this.interpolate(this.component.template, {item: data}) : data.label;
  }
}
