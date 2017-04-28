import { BaseWithDatasourceComponent } from '../base/BaseWithDatasource';
import Choices from 'choices.js';
import Formio from '../../formio';
import _each from 'lodash/each';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
export class SelectComponent extends BaseWithDatasourceComponent {
  elementInfo() {
    let info = super.elementInfo();
    info.type = 'select';
    info.changeEvent = 'change';
    return info;
  }

  createWrapper() {
    return false;
  }

  setItems(items) {
    if (!this.choices) {
      return;
    }
    this.choices._clearChoices();
    _each(items, (item) => {
      this.choices._addChoice(false, false, this.itemValue(item), this.itemTemplate(item));
    });
    if (this.value) {
      this.setValue(this.value, true);
    }
  }

  addInput(input, container) {
    super.addInput(input, container, true);
    if (this.component.multiple) {
      input.setAttribute('multiple', true);
    }
    var self = this;
    this.choices = new Choices(input, {
      placeholder: !!this.component.placeholder,
      placeholderValue: this.component.placeholder,
      removeItemButton: true,
      classNames: {
        containerOuter: 'choices form-group formio-choices',
        containerInner: 'form-control'
      }
    });
    if (this.disabled) {
      this.choices.disable();
    }
    this.updateItems();
  }

  set disable(disable) {
    super.disable = disable;
    if (!this.choices) {
      return;
    }
    if (disable) {
      this.choices.disable();
    }
    else {
      this.choices.enable();
    }
  }

  getValue() {
    return this.choices.getValue(true);
  }

  setValue(value, noUpdate, noValidate) {
    this.value = value;
    if (value && this.choices) {
      if (this.choices.store) {
        // Search for the choice.
        const choices = this.choices.store.getChoices();
        const foundChoice = choices.find((choice) => {
          return choice.value === value;
        });

        // If it is not found, then add it.
        if (!foundChoice) {
          this.choices._addChoice(false, false, this.itemValue(value), this.itemTemplate(value));
        }
      }

      // Now set the value.
      this.choices.setValueByChoice(_isArray(value) ? this.itemValue(value) : [this.itemValue(value)]);
    }
    if (!noUpdate) {
      this.updateValue(noValidate);
    }
  }

  destroy() {
    if (this.choices) {
      this.choices.destroy();
    }
  }
}
