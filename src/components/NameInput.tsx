import * as React from 'react';
import './NameInput.css';

import { DEFAULT_NAME } from '../utility/constants';

import LocalDatabase from '../utility/LocalDatabase';

interface NameInputProps {
  notifyNameUpdate: () => void;
}

interface NameInputState {
  inputName: string; // The string currently typed in the input
  registeredName: string; // The name stored in the DB
}

class NameInput extends React.Component<NameInputProps, NameInputState> {
  constructor(props: NameInputProps) {
    super(props);
    this.state = {
      inputName: '',
      registeredName: ''
    };

    LocalDatabase.getName().then((name: string) => {
      this.setState({
        inputName: name,
        registeredName: name
      });
      this.props.notifyNameUpdate();
    });
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputName: event.target.value });
  }

  private handleConfirm = () => {
    const newName = this.state.inputName || DEFAULT_NAME;
    this.setState({
      inputName: newName,
      registeredName: newName
    });
    LocalDatabase.setName(newName).then(() => {
      this.props.notifyNameUpdate();
    });
  }

  public render() {
    return (
      <section className="name-input">
        <div className="name-input-container">
          <input
            type="text"
            placeholder="名前を入力"
            value={this.state.inputName}
            onChange={this.handleChange}/>
          <button
            onClick={this.handleConfirm}
            disabled={this.state.inputName === this.state.registeredName}>
            決定
          </button>
          </div>
      </section>
    );
  }
}

export default NameInput;
