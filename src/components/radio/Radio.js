import { BaseWithJsonItemsComponent } from '../base/BaseWithJsonItems';
import _each from 'lodash/each';
export class RadioComponent extends BaseWithJsonItemsComponent {
  elementInfo() {
    let info = super.elementInfo();
    info.type = 'input';
    info.changeEvent = 'click';
    info.attr.class = '';
    return info;
  }

  createInput(container) {
    this.updateItems(container); // sebaseba: agregar los items a inputgroup
  }

  setItems(items, container) {
    let inputGroup = this.ce('inputGroup', 'div', {
      class: 'input-group'
    });
    let inputType = this.component.inputType;
    _each(items, (item) => {
      const value = this.itemValue(item);
      var wrapperClass = (this.component.inline ? inputType + '-inline' : inputType);
      let labelWrapper = this.ce('labelWrapper', 'div', {
        class: wrapperClass
      });
      let label = this.ce('label', 'label', {
        class: 'control-label'
      });

      // Determine the attributes for this input.
      let inputId = this.inputId + '-' + value;
      this.info.attr.id = inputId;
      this.info.attr.value = value;
      label.setAttribute('for', this.info.attr.id);

      // Create the input.
      let input = this.ce('input', 'input');
      _each(this.info.attr, function(value, key) {
        input.setAttribute(key, value);
      });
      this.addInput(input, label);
      label.appendChild(document.createTextNode(item.label));
      labelWrapper.appendChild(label);
      inputGroup.appendChild(labelWrapper);
    });
    if (container) {
      container.appendChild(inputGroup);
    }
  }

  getValue() {
    let value = '';
    _each(this.inputs, (input) => {
      if (input.checked) {
        value = input.value;
      }
    });
    return value;
  }

  setValueAt(value, index) {
    this.inputs[index].checked = (this.inputs[index].value === value);
  }
}
