import React, { useState, useEffect } from 'react';
import shortid from 'shortid';

import ContactForm from './ContactForm/ContactForm';
import ContactsList from './ContactsList/ContactsList';
import Filter from './Filter/Filter';

import contactsList from './contacts';

import css from './App.module.css';

const App = () => {
  const [contacts, setContacts] = useState(() => {
    const contacts = JSON.parse(localStorage.getItem('my-contacts'));
    return contacts ? contacts : [...contactsList];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('my-contacts', JSON.stringify(contacts));
  }, [contacts]);

  const isDuplicate = name => {
    const normalized = name.toLowerCase();
    const result = contacts.find(({ name }) => {
      return normalized === name.toLowerCase();
    });

    return Boolean(result);
  };

  const addContact = ({ name, number }) => {
    if (isDuplicate(name)) {
      alert(`${name} is already in contacts`);
      return false;
    }

    setContacts(prevContacts => {
      const newContact = {
        id: shortid.generate(),
        name,
        number,
      };

      return [newContact, ...prevContacts];
    });

    return true;
  };

  const deleteContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const getVisibleContacts = () => {
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  const handleFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const visibleContacts = getVisibleContacts();
  const isContacts = Boolean(visibleContacts.length);

  return (
    <div className={css.wrapper}>
      <h2>Phonebook</h2>
      <ContactForm onSubmit={addContact} />

      <h2>Contacts</h2>
      <Filter value={filter} onChange={handleFilter} />

      {isContacts && (
        <ContactsList
          contacts={visibleContacts}
          deleteContact={deleteContact}
        />
      )}
      {!isContacts && <p className={css.text}>No contacts in list</p>}
    </div>
  );
};

export default App;
