// pages/invoice/new.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Define types
type InvoiceItem = {
  id: string;
  item: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
};

type Invoice = {
  client: string;
  number: string;
  year: string;
  currency: string;
  status: string;
  date: string;
  expireDate: string;
  note: string;
  items: InvoiceItem[];
  subTotal: number;
  tax: number;
  total: number;
};

export default function NewInvoice() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice>({
    client: '',
    number: '1',
    year: '2025',
    currency: 'US Dollar',
    status: 'Draft',
    date: format(new Date(), 'MM/dd/yyyy'),
    expireDate: format(new Date(Date.now() + 86400000), 'MM/dd/yyyy'), // Next day
    note: '',
    items: [{ id: '1', item: '', description: '', quantity: 0, price: 0, total: 0 }],
    subTotal: 0,
    tax: 0,
    total: 0,
  });

  const addItem = () => {
    const newItem = {
      id: String(invoice.items.length + 1),
      item: '',
      description: '',
      quantity: 0,
      price: 0,
      total: 0,
    };
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if quantity or price changes
        if (field === 'quantity' || field === 'price') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'price' ? Number(value) : item.price;
          updatedItem.total = quantity * price;
        }
        
        return updatedItem;
      }
      return item;
    });

    // Recalculate subtotal and total
    const subTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const total = subTotal + invoice.tax;
    
    setInvoice({ ...invoice, items: updatedItems, subTotal, total });
  };

  const removeItem = (id: string) => {
    const filteredItems = invoice.items.filter(item => item.id !== id);
    
    // Recalculate subtotal and total
    const subTotal = filteredItems.reduce((sum, item) => sum + item.total, 0);
    const total = subTotal + invoice.tax;
    
    setInvoice({ ...invoice, items: filteredItems, subTotal, total });
  };

  const handleInputChange = (field: keyof Invoice, value: string | number) => {
    if (field === 'tax') {
      // Ensure tax is always a number
      const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      setInvoice(prev => ({
        ...prev,
        tax: numericValue,
        total: prev.subTotal + numericValue
      }));
    } else {
      // For other fields, just update the value
      setInvoice(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    console.log('Saving invoice:', invoice);
    // Here you would typically save to API or database
    router.push('/invoices'); // Redirect to invoices list
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container  mx-auto p-4">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">New</h1>
          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">Draft</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Client
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="search"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={invoice.client}
              onChange={(e) => handleInputChange('client', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Number
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Year
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Currency
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={invoice.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={invoice.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Date
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={invoice.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Expire Date
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={invoice.expireDate}
              onChange={(e) => handleInputChange('expireDate', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Note
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium">Quantity</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={item.item}
                      onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                      placeholder="Item Name"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="description Name"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-3 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={item.price || ''}
                        onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      />
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">$</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={item.total.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button
          onClick={addItem}
          className="mt-4 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 px-4 w-full flex items-center justify-center hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Field
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Save
        </button>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 mr-4">Sub Total :</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">$</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 pl-6 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={invoice.subTotal.toFixed(2)}
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">Select Tax Value</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">$</span>
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2 pl-6 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={invoice.tax || ''}
                onChange={(e) => handleInputChange('tax', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium mr-4">Total :</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">$</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 pl-6 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={invoice.total.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}