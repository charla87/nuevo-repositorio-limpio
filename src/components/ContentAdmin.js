import React, { useState, useEffect } from 'react';
import { getContents, createContent, updateContent, deleteContent } from '../services/contentService';
import { Button, Form, Modal, Table, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './ContentAdmin.css';

const ContentAdmin = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newField, setNewField] = useState('');
  const [dynamicFields, setDynamicFields] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getContents();
        setEntries(data);
        setFilteredEntries(data);
        if (data.length > 0) {
          const fields = Object.keys(data[0]).filter(
            (key) => !['id', 'producto', 'acabado', 'nTablas', 'galeriaImagen', 'imagenPrincipal', 'm2', 'dimensiones'].includes(key)
          );
          setDynamicFields(fields);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contents:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    setFilteredEntries(
      entries.filter(entry =>
        entry.producto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, entries]);

  const handleAddEntry = () => {
    const newEntry = {
      producto: '',
      acabado: '',
      nTablas: '',
      galeriaImagen: [],
      imagenPrincipal: '',
      m2: '',
      dimensiones: '',
      ...Object.fromEntries(dynamicFields.map(field => [field, '']))
    };
    setEditingEntry(newEntry);
    setShowModal(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const handleSaveEntry = async () => {
    try {
      if (editingEntry.id) {
        await updateContent(editingEntry.id, editingEntry);
        setEntries((prevEntries) => prevEntries.map((e) => (e.id === editingEntry.id ? editingEntry : e)));
      } else {
        const newEntry = await createContent(editingEntry);
        setEntries((prevEntries) => [...prevEntries, newEntry]);
      }
      setEditingEntry(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving content:', error);
      setError(error);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteContent(id);
        setEntries((prevEntries) => prevEntries.filter((e) => e.id !== id));
        toast.success('Entry deleted successfully', { autoClose: 2000 });
      } catch (error) {
        console.error('Error deleting content:', error);
        setError(error);
        toast.error('Failed to delete entry', { autoClose: 2000 });
      }
    }
  };

  const handleCloseModal = () => {
    setEditingEntry(null);
    setShowModal(false);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const urls = [];
    setUploading(true);
    try {
      for (const file of files) {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      setEditingEntry((prevEntry) => ({ ...prevEntry, galeriaImagen: [...prevEntry.galeriaImagen, ...urls] }));
      toast.success('Images uploaded successfully', { autoClose: 2000 });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images', { autoClose: 2000 });
    } finally {
      setUploading(false);
    }
  };

  const handleAddField = () => {
    if (newField && !dynamicFields.includes(newField)) {
      setDynamicFields([...dynamicFields, newField]);
      setEntries((prevEntries) => prevEntries.map(entry => ({ ...entry, [newField]: '' })));
      setNewField('');
    }
  };

  const handleDeleteField = (field) => {
    setDynamicFields(dynamicFields.filter(f => f !== field));
    setEntries((prevEntries) => prevEntries.map(entry => {
      const { [field]: _, ...rest } = entry;
      return rest;
    }));
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Content Management</h1>
      <Button variant="primary" className="mb-4" onClick={handleAddEntry}>
        Add Entry
      </Button>

      <Form className="mb-4">
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Buscar productos"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>

      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>Document ID</th>
            <th>Producto</th>
            <th>Acabado</th>
            <th>N Tablas</th>
            <th>Galería de Imagen</th>
            <th>Imagen Principal</th>
            <th>M2</th>
            <th>Dimensiones</th>
            {dynamicFields.map(field => (
              <th key={field}>{field}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry) => (
            <tr key={entry.id}>
              <td><Link to={`/product/${entry.id}`}>{entry.id}</Link></td>
              <td>{entry.producto}</td>
              <td>{entry.acabado}</td>
              <td>{entry.nTablas}</td>
              <td>
                {Array.isArray(entry.galeriaImagen) && entry.galeriaImagen.map((img, index) => (
                  <img key={index} src={img} alt={`Galeria ${index}`} width="50" className="mr-2" />
                ))}
              </td>
              <td><img src={entry.imagenPrincipal} alt="Imagen Principal" width="50" /></td>
              <td>{entry.m2}</td>
              <td>{entry.dimensiones}</td>
              {dynamicFields.map(field => (
                <td key={field}>{entry[field]}</td>
              ))}
              <td>
                <Button variant="info" className="mr-2" onClick={() => handleEditEntry(entry)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteEntry(entry.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingEntry && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingEntry.id ? 'Edit Entry' : 'Add Entry'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Producto</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEntry.producto}
                  onChange={(e) => setEditingEntry({ ...editingEntry, producto: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Acabado</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEntry.acabado}
                  onChange={(e) => setEditingEntry({ ...editingEntry, acabado: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>N Tablas</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEntry.nTablas}
                  onChange={(e) => setEditingEntry({ ...editingEntry, nTablas: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Galería de Imagen</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p>Uploading...</p>}
                {Array.isArray(editingEntry.galeriaImagen) && editingEntry.galeriaImagen.map((img, index) => (
                  <img key={index} src={img} alt={`Galeria ${index}`} width="50" className="mr-2" />
                ))}
              </Form.Group>
              <Form.Group>
                <Form.Label>Imagen Principal</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p>Uploading...</p>}
                {editingEntry.imagenPrincipal && <img src={editingEntry.imagenPrincipal} alt="Imagen Principal" width="100" />}
              </Form.Group>
              <Form.Group>
                <Form.Label>M2</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEntry.m2}
                  onChange={(e) => setEditingEntry({ ...editingEntry, m2: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Dimensiones</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEntry.dimensiones}
                  onChange={(e) => setEditingEntry({ ...editingEntry, dimensiones: e.target.value })}
                />
              </Form.Group>
              {dynamicFields.map(field => (
                <Form.Group key={field}>
                  <Form.Label>{field}</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingEntry[field] || ''}
                    onChange={(e) => setEditingEntry({ ...editingEntry, [field]: e.target.value })}
                  />
                </Form.Group>
              ))}
              <Button variant="primary" onClick={handleSaveEntry}>
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      <ToastContainer />

      <Form className="mt-4">
        <Form.Group controlId="newField">
          <Form.Control
            type="text"
            placeholder="New Field Name"
            value={newField}
            onChange={e => setNewField(e.target.value)}
          />
        </Form.Group>
        <Button variant="secondary" onClick={handleAddField}>
          Add New Field
        </Button>
      </Form>

      <ul className="list-inline mt-3">
        {dynamicFields.map(field => (
          <li key={field} className="list-inline-item">
            {field} <Button variant="danger" size="sm" onClick={() => handleDeleteField(field)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentAdmin;
