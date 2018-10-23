import * as React from 'react';
import './NameInput.css';

import { DEFAULT_NAME } from '../utility/constants';

interface NameInputProps {
  name: string;
  setName: (name: string) => void;
}

interface NameInputState {
  isConfirmButtonAvailable: boolean; // True if there is a change in the input name
}

class NameInput extends React.Component<NameInputProps, NameInputState> {
  private currentInputName: string;
  private shouldAcceptProps = true; // True when the name is fetched from DB; false otherwise because currentInputName holds the up-to-date input name

  constructor(props: NameInputProps) {
    super(props);
    this.state = {
      isConfirmButtonAvailable: false
    };
    this.currentInputName = name;
  }

  public shouldComponentUpdate(nextProps: NameInputProps): boolean {
    if (this.shouldAcceptProps) {
      this.currentInputName = nextProps.name;
      this.shouldAcceptProps = false;
    }
    return true;
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.currentInputName = event.target.value;
    this.setState({isConfirmButtonAvailable: this.currentInputName !== this.props.name});
  }

  private handleConfirm = () => {
    this.currentInputName = this.currentInputName || DEFAULT_NAME;
    this.props.setName(this.currentInputName);
    this.setState({isConfirmButtonAvailable: false});
  }

  public render() {
    return (
      <section className="name-input">
        <div className="name-input-container">
          <input
            type="text"
            placeholder="名前を入力"
            value={this.currentInputName}
            onChange={this.handleChange}/>
          <button
            onClick={this.handleConfirm}
            disabled={!this.state.isConfirmButtonAvailable}>
            決定
          </button>
          </div>
      </section>
    );
  }
}

export default NameInput;
