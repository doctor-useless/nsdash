import React, { Component } from 'react'
import './ConfirmDelete.css' // eslint-disable-line

export default class Menu extends Component {
  componentDidMount() {
    // attach event listeners
    document.body.addEventListener('keydown', this.handleEscKey)
  }
  componentWillUnmount() {
    // remove event listeners
    document.body.removeEventListener('keydown', this.handleEscKey)
  }
  handleEscKey = (e) => {
    if (this.props.showMenu && e.which === 27) {
      this.props.handleModalClose()
    }
  }
  render() {
    const { showMenu } = this.props
    const showOrHide = (showMenu) ? 'flex' : 'none'
    return (
      <div className='settings-wrapper' style={{display: showOrHide}}>
        <div className='settings-content'>
          <span className='settings-close' onClick={this.props.handleModalClose} role="img" aria-label='close'>
            ❌
          </span>
          <h2>Delete {this.props.contact.name}</h2>
          <div className='settings-section' onClick={this.props.handleDelete}>
            <button className='btn-danger'>
              Delete contact
            </button>
          </div>
        </div>
      </div>
    )
  }
}
