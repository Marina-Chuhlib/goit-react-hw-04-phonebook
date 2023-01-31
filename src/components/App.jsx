import { Component } from 'react';
import shortid from 'shortid';

import ContactForm from './ContactForm/ContactForm';
import ContactsList from './ContactsList/ContactsList';
import Filter from './Filter/Filter';

import css from './App.module.css';

class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('my-contacts'));

    if (contacts?.length) {
      this.setState({ contacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;

    if (prevState.contacts !== contacts) {
      localStorage.setItem('my-contacts', JSON.stringify(contacts));
    }
  }

  addContact = ({ name, number }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    this.setState(({ contacts }) =>
      contacts.find(
        contacts => contacts.name.toLowerCase() === contact.name.toLowerCase()
      )
        ? alert(`${contact.name} is already in contacts`)
        : {
            contacts: [contact, ...contacts],
          }
    );
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  handleFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  deleteContact = contactId => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== contactId),
    }));
  };

  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();
    const isContacts = Boolean(visibleContacts.length);

    return (
      <div className={css.wrapper}>
        <h2>Phonebook</h2>
        <ContactForm onSubmit={this.addContact} />

        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.handleFilter} />

        <ContactsList
          contacts={visibleContacts}
          deleteContact={this.deleteContact}
        />
        {!isContacts && <p className={css.text}>No contacts in list</p>}
      </div>
    );
  }
}

export default App;
