import React, { Component } from 'react'
import './Contacts.css'
import ContentEditable from '../ContentEditable'
import Confirm from '../Confirm'
import api from '../../utils/contacts-api'
import isLocalHost from '../../utils/isLocalHost'

export default class Contacts extends Component {
    state = {
        contacts: []
    }
    componentDidMount() {
        // Fetch all contacts
        api.readAll().then((contacts) => {
            if (contacts.message === 'unauthorized') {
                if (isLocalHost()) {
                    console.error('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
                } else {
                    console.error('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
                }
                return false
            }
            this.setState({
                contacts: contacts
            })
        })
    }
    saveContact = (e) => {
        e.preventDefault();
        const { contacts } = this.state;
        const contactNameValue = this.inputNameElement.value;
        const contactEmailValue = this.inputEmailElement.value;
        const contactPhoneValue = this.inputPhoneElement.value;
        const contactNoteValue = this.inputNoteElement.value;

        if (!contactNameValue) {
            this.inputNameElement.focus();
            return false;
        } else if (!contactEmailValue && !contactPhoneValue) {
            this.inputEmailElement.focus();
            return false;
        }

        // reset inputs to empty
        this.inputNameElement.value = '';
        this.inputEmailElement.value = '';
        this.inputPhoneElement.value = '';
        this.inputNoteElement.value = '';

        const contactInfo = {
            name: contactNameValue,
            email: contactEmailValue,
            phone: contactPhoneValue,
            note: contactNoteValue,
            date: Date.now()
        }

        // Optimistically add contact to UI
        const newContactArray = [{
            data: contactInfo
        }];

        const optimisticContactState = newContactArray.concat(contacts)

        this.setState({
            contacts: optimisticContactState
        })
        // Make API request to create new contact
        api.create(contactInfo).then((response) => {
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
    deleteContact = (props) => {
        const { contacts } = this.state
        const contactId = props.id
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

        // Make API request to delete contact .then(()=>console.log('done').catch
        api.delete(contactId).catch((e) => {
            console.log(`There was an error removing ${contactId}`, e)
            // Add item removed back to list
            this.setState({
                contacts: filteredContacts.optimisticState.concat(filteredContacts.rollbackContact)
            })
        })
    }
    updateContactName = (event, currentValue) => {
        let isDifferent = false
        const contactId = event.target.dataset.key

        const updatedContacts = this.state.contacts.map((contact, i) => {
            const id = getContactId(contact)
            if (id === contactId && contact.data.name !== currentValue) {
                contact.data.name = currentValue
                isDifferent = true
            }
            return contact
        })

        // only set state if input different
        if (isDifferent)
            updateState(this, updatedContacts, contactId, { name: currentValue }, currentValue);
    }
    updateContactEmail = (event, currentValue) => {
        let isDifferent = false
        const contactId = event.target.dataset.key

        const updatedContacts = this.state.contacts.map((contact, i) => {
            const id = getContactId(contact)
            if (id === contactId && contact.data.email !== currentValue) {
                contact.data.email = currentValue
                isDifferent = true
            }
            return contact
        })

        // only set state if input different
        if (isDifferent)
            updateState(this, updatedContacts, contactId, { email: currentValue }, currentValue);
    }
    updateContactPhone = (event, currentValue) => {
        let isDifferent = false
        const contactId = event.target.dataset.key

        const updatedContacts = this.state.contacts.map((contact, i) => {
            const id = getContactId(contact)
            if (id === contactId && contact.data.phone !== currentValue) {
                contact.data.phone = currentValue
                isDifferent = true
            }
            return contact
        })

        // only set state if input different
        if (isDifferent)
            updateState(this, updatedContacts, contactId, { phone: currentValue }, currentValue);
    }
    updateContactNote = (event, currentValue) => {
        let isDifferent = false
        const contactId = event.target.dataset.key

        const updatedContacts = this.state.contacts.map((contact, i) => {
            const id = getContactId(contact)
            if (id === contactId && contact.data.note !== currentValue) {
                contact.data.note = currentValue
                isDifferent = true
            }
            return contact
        })

        // only set state if input different
        if (isDifferent)
            updateState(this, updatedContacts, contactId, { note: currentValue }, currentValue);
    }
    renderContacts() {
        let { contacts } = this.state;

        if (!contacts || !contacts.length) {
            // Loading State here
            return null;
        }

        return contacts.map((contact, i) => {
            const { data, ref } = contact
            const id = getContactId(contact)
            // only show delete button after create API response returns
            let deleteButton
            if (ref) {
                deleteButton = (
                    <Confirm
                    handleConfirmation={this.deleteContact}
                    message={'Delete ' + data.name}
                    action='delete'
                    id={id}
                />
                )
            }
            return (
                <div key={i} className='contact-item'>
                    <ContentEditable
                        tagName='div'
                        editKey={id}
                        onBlur={this.updateContactName}
                        html={data.name}
                    />
                    <ContentEditable
                        tagName='div'
                        editKey={id}
                        onBlur={this.updateContactEmail}
                        html={data.email}
                    />
                    <ContentEditable
                        tagName='div'
                        editKey={id}
                        onBlur={this.updateContactPhone}
                        html={data.phone}
                    />
                    <ContentEditable
                        tagName='div'
                        editKey={id}
                        onBlur={this.updateContactNote}
                        html={data.note}
                    />
                    {deleteButton}
                </div>
            )
        })
    }
    render() {
        return (
            <div className='contact-list'>
                <h2>Create contact</h2>
                <form className='contact-create-wrapper' onSubmit={this.saveContact}>
                    <input
                        className='contact-create-input'
                        placeholder='name'
                        name='name'
                        ref={el => this.inputNameElement = el}
                        autoComplete='off'
                        style={{ marginRight: 20 }}
                    />
                    <input
                        className='contact-create-input'
                        placeholder='email'
                        name='email'
                        ref={el => this.inputEmailElement = el}
                        autoComplete='off'
                        style={{ marginRight: 20 }}
                    />
                    <input
                        className='contact-create-input'
                        placeholder='phone'
                        name='phone'
                        ref={el => this.inputPhoneElement = el}
                        autoComplete='off'
                        style={{ marginRight: 20 }}
                    />
                    <textarea
                        className='contact-create-input'
                        placeholder='note'
                        name='note'
                        ref={el => this.inputNoteElement = el}
                        autoComplete='off'
                        style={{ marginRight: 20 }}
                    />
                    <div className='contact-actions'>
                        <button className='contact-create-button'>create contact</button>
                    </div>
                </form>

                {this.renderContacts()}
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

function updateState(scope, updatedContacts, contactId, update, currentValue) {
    scope.setState({
        contacts: updatedContacts
    }, () => {
        api.update(contactId, update).catch((e) => {
            console.log('An API error occurred', e)
        })
    })
}