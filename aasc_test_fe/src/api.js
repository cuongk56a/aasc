import axios from 'axios';

// const BITRIX_DOMAIN = 'http://localhost:3000';
const BITRIX_DOMAIN = 'https://12fd-113-161-61-153.ngrok-free.app';

export const getContacts = async () => {
  const res = await axios.post(`${BITRIX_DOMAIN}/contact/list`);
  return res.data;
};

export const getContact = async (id) => {
  const res = await axios.get(`${BITRIX_DOMAIN}/contact/${id}`);
  return res.data.result;
};

export const addContact = async (contact) => {
  await axios.post(`${BITRIX_DOMAIN}/contact/create`, {
   ...contact
  });
};

export const updateContact = async (id, contact) => {
  await axios.patch(`${BITRIX_DOMAIN}/contact/${id}`, {
...contact
  });
};

export const deleteContact = async (id) => {
  await axios.delete(`${BITRIX_DOMAIN}/contact/${id}`, );
};

export const getRequisites = async (contactId) => {
  const res = await axios.post(`${BITRIX_DOMAIN}/requisite/list/${contactId}`);
  return res.data;
};


export const addRequisite = async (requisite) => {
  const res = await axios.post(`${BITRIX_DOMAIN}/requisite/create`, {
   ...requisite
  });
  return res.data;
};

export const updateRequisite = async (id, requisite) => {
  await axios.patch(`${BITRIX_DOMAIN}/requisite/${id}`, {
...requisite
  });
};

export const deleteRequisite = async (id) => {
  await axios.delete(`${BITRIX_DOMAIN}/requisite/${id}`, );
};
