import React, { Component } from 'react'
import ContentEditable from './components/ContentEditable'
import AppHeader from './components/AppHeader'
import SettingsMenu from './components/SettingsMenu'
import SettingsIcon from './components/SettingsIcon'
import api from './utils/api'
import sortByDate from './utils/sortByDate'
import isLocalHost from './utils/isLocalHost'
import './App.css'

export default class App extends Component {
  state = {
    contacts: [],
    showMenu: false
  }
  componentDidMount() {
    // Fetch all contacts
    api.readAll().then((contacts) => {
      if (contacts.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }

      console.log('all contacts', contacts)
      this.setState({
        contacts: contacts
      })
    })
  }
  saveContact = (e) => {
    e.preventDefault()
    const { contacts } = this.state
    const contactValue = this.inputElement.value

    if (!contactValue) {
      alert('Please add contact title')
      this.inputElement.focus()
      return false
    }

    // reset input to empty
    this.inputElement.value = ''

    const contactInfo = {
      title: contactValue,
      completed: false,
    }
    // Optimistically add contact to UI
    const newContactArray = [{
      data: contactInfo,
      ts: new Date().getTime() * 10000
    }]

    const optimisticContactState = newcontactArray.concat(contacts)

    this.setState({
      contacts: optimisticContactState
    })
    // Make API request to create new contact
    api.create(contactInfo).then((response) => {
      console.log(response)
      // remove temporaryValue from state and persist API response
      const persistedState = removeOptimisticContact(contacts).concat(response)
      // Set persisted value to state
      this.setState({
        contacts: persistedState
      })
    }).catch((e) => {
      console.log('An API error occurred', e)
      const revertedState = removeOptimisticContact(contacts)
      // Reset to original state
      this.setState({
        contacts: revertedState
      })
    })
  }
  deleteContact = (e) => {
    const { contacts } = this.state
    const contactId = e.target.dataset.id

    // Optimistically remove contact from UI
    const filteredContacts = contacts.reduce((acc, current) => {
      const currentId = getContactId(current)
      if (currentId === contactId) {
        // save item being removed for rollback
        acc.rollbackContact = current
        return acc
      }
      // filter deleted contact out of the contacts list
      acc.optimisticState = acc.optimisticState.concat(current)
      return acc
    }, {
      rollbackContact: {},
      optimisticState: []
    })

    this.setState({
      contacts: filteredContacts.optimisticState
    })

    // Make API request to delete contact
    api.delete(contactId).then(() => {
      console.log(`deleted contact id ${contactId}`)
    }).catch((e) => {
      console.log(`There was an error removing ${contactId}`, e)
      // Add item removed back to list
      this.setState({
        contacts: filteredContacts.optimisticState.concat(filteredContacts.rollbackContact)
      })
    })
  }
  handleContactCheckbox = (event) => {
    const { contacts } = this.state
    const { target } = event
    const contactCompleted = target.checked
    const contactId = target.dataset.id

    const updatedContacts = contacts.map((contact, i) => {
      const { data } = contact
      const id = getContactId(contact)
      if (id === contactId && data.completed !== contactCompleted) {
        data.completed = contactCompleted
      }
      return contact
    })

    this.setState({
      contacts: updatedContacts
    }, () => {
      api.update(contactId, {
        completed: contactCompleted
      }).then(() => {
        console.log(`update contact ${contactId}`, contactCompleted)
      }).catch((e) => {
        console.log('An API error occurred', e)
      })
    })
  }
  updateContactTitle = (event, currentValue) => {
    let isDifferent = false
    const contactId = event.target.dataset.key

    const updatedContacts = this.state.contacts.map((contact, i) => {
      const id = getContactId(contact)
      if (id === contactId && contact.data.title !== currentValue) {
        contact.data.title = currentValue
        isDifferent = true
      }
      return contact
    })

    // only set state if input different
    if (isDifferent) {
      this.setState({
        contacts: updatedContacts
      }, () => {
        api.update(contactId, {
          title: currentValue
        }).then(() => {
          console.log(`update contact ${contactId}`, currentValue)
        }).catch((e) => {
          console.log('An API error occurred', e)
        })
      })
    }
  }
  clearCompleted = () => {
    const { contacts } = this.state

    // Optimistically remove contacts from UI
    const data = contacts.reduce((acc, current) => {
      if (current.data.completed) {
        // save item being removed for rollback
        acc.completedContactIds = acc.completedContactIds.concat(getContactId(current))
        return acc
      }
      // filter deleted contact out of the contacts list
      acc.optimisticState = acc.optimisticState.concat(current)
      return acc
    }, {
      completedContactIds: [],
      optimisticState: []
    })

    // only set state if completed contacts exist
    if (!data.completedContactIds.length) {
      alert('Please check off some contacts to batch remove them')
      this.closeModal()
      return false
    }

    this.setState({
      contacts: data.optimisticState
    }, () => {
      setTimeout(() => {
        this.closeModal()
      }, 600)

      api.batchDelete(data.completedContactIds).then(() => {
        console.log(`Batch removal complete`, data.completedContactIds)
      }).catch((e) => {
        console.log('An API error occurred', e)
      })
    })
  }
  closeModal = (e) => {
    this.setState({
      showMenu: false
    })
  }
  openModal = () => {
    this.setState({
      showMenu: true
    })
  }
  renderContacts() {
    const { contacts } = this.state

    if (!contacts || !contacts.length) {
      // Loading State here
      return null
    }

    const timeStampKey = 'ts'
    const orderBy = 'desc' // or `asc`
    const sortOrder = sortByDate(timeStampKey, orderBy)
    const contactsByDate = contacts.sort(sortOrder)

    return contactsByDate.map((contact, i) => {
      const { data, ref } = contact
      const id = getContactId(contact)
      // only show delete button after create API response returns
      let deleteButton
      if (ref) {
        deleteButton = (<button data-id={id} onClick={this.deleteContact}>delete</button>)
      }
      const boxIcon = (data.completed) ? '#contact__box__done' : '#contact__box'
      return (
        <div key={i} className='contact-item'>
          <label className="contact">
            <input
              data-id={id}
              className="contact__state"
              type="checkbox"
              onChange={this.handleContactCheckbox}
              checked={data.completed}
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 25" className="contact__icon">
              <use xlinkHref={`${boxIcon}`} className="contact__box"></use>
              <use xlinkHref="#contact__check" className="contact__check"></use>
            </svg>
            <div className='contact-list-title'>
              <ContentEditable
                tagName='span'
                editKey={id}
                onBlur={this.updateContactTitle} // save on enter/blur
                html={data.title}
                // onChange={this.handleDataChange} // save on change
              />
            </div>
          </label>
          {deleteButton}
        </div>
      )
    })
  }
  render() {
    return (
      <div className='app'>

        <AppHeader />

        <div className='contact-list'>
          <h2>
            Create contact
            <SettingsIcon onClick={this.openModal} className='mobile-toggle' />
          </h2>
          <form className='contact-create-wrapper' onSubmit={this.saveContact}>
            <input
              className='contact-create-input'
              placeholder='Add a contact'
              name='name'
              ref={el => this.inputElement = el}
              autoComplete='off'
              style={{marginRight: 20}}
            />
            <div className='contact-actions'>
              <button className='contact-create-button'>Create contact</button>
              <SettingsIcon onClick={this.openModal}  className='desktop-toggle' />
            </div>
          </form>

          {this.rendercontacts()}
        </div>
        <SettingsMenu
          showMenu={this.state.showMenu}
          handleModalClose={this.closeModal}
          handleClearCompleted={this.clearCompleted}
        />
      </div>
    )
  }
}

function removeOptimisticContact(contacts) {
  // return all 'real' contacts
  return contacts.filter((contact) => {
    return contact.ref
  })
}

function getContactId(contact) {
  if (!contact.ref) {
    return null
  }
  return contact.ref['@ref'].id
}
