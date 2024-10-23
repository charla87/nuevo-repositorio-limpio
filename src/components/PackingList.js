// src/components/PackingList.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './PackingList.css';

const PackingList = ({ referencia, productName }) => {
  const [packingList, setPackingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (referencia) {
      const fetchPackingList = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/packinglist/${referencia}`);
          setPackingList(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching packing list:', error);
          setError(error);
          setLoading(false);
        }
      };

      fetchPackingList();
    }
  }, [referencia]);

  const handleCopyTable = () => {
    const table = document.getElementById('packingListTable');
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Packing List for ${productName}`, 10, 10);
    doc.autoTable({
      head: [packingList[0]],
      body: packingList.slice(1),
    });
    doc.save('packinglist.pdf');
  };

  const handleDownloadXLSX = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(packingList);
    XLSX.utils.book_append_sheet(wb, ws, 'Packing List');
    XLSX.writeFile(wb, 'packinglist.xlsx');
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3 className="mb-4">Packing List for {productName}</h3>
      <Button variant="outline-primary" className="mr-2 styled-button" onClick={handleCopyTable}>
        <i className="bi bi-clipboard"></i> Copy
      </Button>
      <Button variant="outline-success" className="mr-2 styled-button" onClick={handleDownloadPDF}>
        <i className="bi bi-file-earmark-pdf"></i> Download PDF
      </Button>
      <Button variant="outline-info" className="styled-button" onClick={handleDownloadXLSX}>
        <i className="bi bi-file-earmark-excel"></i> Download XLSX
      </Button>
      {packingList ? (
        <Table striped bordered hover id="packingListTable" className="mt-3">
          <thead>
            <tr>
              {packingList[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packingList.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No packing list found for this product.</div>
      )}
    </div>
  );
};

export default PackingList;
