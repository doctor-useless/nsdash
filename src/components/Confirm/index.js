import React, { Component } from 'react'
import './Confirm.css' // eslint-disable-line

export default class Confirm extends Component {
  state = {
    showConfirmation: false
  }
  showConfirmation = (e) => {
    this.setState({
      showConfirmation: true
    });
  }
  hideConfirmation = (e) => {
    this.setState({
      showConfirmation: false
    })
  }
  handleConfirmation = (e) => {
    this.hideConfirmation();
    this.props.handleConfirmation(this.props);
  }
  render() {
    return (<div>
      <button onClick={this.showConfirmation}>{this.props.action}</button>
      <Confirmation visible={this.state.showConfirmation} message={this.props.message} handleConfirmation={this.handleConfirmation} handleClose={this.hideConfirmation} />
    </div>
    );
  }
}

class Confirmation extends Component {
  componentDidMount() {
    // attach event listeners
    document.body.addEventListener('keydown', this.handleEscKey)
    //this.handleClose = this.props.handleClose.bind(this);
  }
  componentWillUnmount() {
    // remove event listeners
    document.body.removeEventListener('keydown', this.handleEscKey)
  }
  handleEscKey = (e) => {
    if (e.which === 27) {
      this.props.handleClose();
    }
  }
  handleConfirmation = (e) => {
    this.props.handleConfirmation();
  }
  render() {
    const showOrHide = (this.props.visible) ? 'flex' : 'none'
    return (
      <div className='settings-wrapper' style={{ display: showOrHide }}>
        <div className='settings-content'>
          <h2>{this.props.message || ''}</h2>
          <div className='settings-section'>
            <button className='btn-standard' onClick={this.props.handleClose}>cancel</button>
            <button className='btn-danger' onClick={this.handleConfirmation}>delete</button>
          </div>
        </div>
      </div>
    )
  }
}
