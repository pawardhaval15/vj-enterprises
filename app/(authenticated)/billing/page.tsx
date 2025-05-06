"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Define types
type Product = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  cgst: number;
  sgst: number;
};

type Invoice = {
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  partyGSTNo: string;
  invoiceDate: string;
  dueDate: string;
  note: string;
  products: Product[];
  totalAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAfterTax: number;
};

export default function NewInvoice() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice>({
    customerName: '',
    customerAddress: '',
    customerMobile: '',
    partyGSTNo: '',
    invoiceDate: format(new Date(), 'MM/dd/yyyy'),
    dueDate: format(new Date(Date.now() + 86400000), 'MM/dd/yyyy'), // Next day
    note: '',
    products: [{ 
      id: '1', 
      name: '', 
      description: '', 
      quantity: 0, 
      rate: 0, 
      amount: 0,
      cgst: 0,
      sgst: 0
    }],
    totalAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    totalAfterTax: 0
  });

  const addProduct = () => {
    const newProduct = {
      id: String(invoice.products.length + 1),
      name: '',
      description: '',
      quantity: 0,
      rate: 0,
      amount: 0,
      cgst: 0,
      sgst: 0
    };
    setInvoice({ ...invoice, products: [...invoice.products, newProduct] });
  };

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    const updatedProducts = invoice.products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        
        // Recalculate amount, CGST, and SGST if quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          const quantity = field === 'quantity' ? Number(value) : product.quantity;
          const rate = field === 'rate' ? Number(value) : product.rate;
          
          updatedProduct.amount = quantity * rate;
          updatedProduct.cgst = updatedProduct.amount * 0.09;
          updatedProduct.sgst = updatedProduct.amount * 0.09;
        }
        
        return updatedProduct;
      }
      return product;
    });

    // Recalculate totals
    const totalAmount = updatedProducts.reduce((sum, product) => sum + product.amount, 0);
    const cgstAmount = updatedProducts.reduce((sum, product) => sum + product.cgst, 0);
    const sgstAmount = updatedProducts.reduce((sum, product) => sum + product.sgst, 0);
    const totalAfterTax = totalAmount + cgstAmount + sgstAmount;
    
    setInvoice({ 
      ...invoice, 
      products: updatedProducts, 
      totalAmount, 
      cgstAmount, 
      sgstAmount, 
      totalAfterTax 
    });
  };

  const removeProduct = (id: string) => {
    const filteredProducts = invoice.products.filter(product => product.id !== id);
    
    // Recalculate totals
    const totalAmount = filteredProducts.reduce((sum, product) => sum + product.amount, 0);
    const cgstAmount = filteredProducts.reduce((sum, product) => sum + product.cgst, 0);
    const sgstAmount = filteredProducts.reduce((sum, product) => sum + product.sgst, 0);
    const totalAfterTax = totalAmount + cgstAmount + sgstAmount;
    
    setInvoice({ 
      ...invoice, 
      products: filteredProducts, 
      totalAmount, 
      cgstAmount, 
      sgstAmount,
      totalAfterTax
    });
  };

  const handleInputChange = (field: keyof Invoice, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Get the token from localStorage or wherever you store it after login
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You must be logged in to create an invoice');
        router.push('/login'); // Redirect to login page
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/invoice/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: invoice.customerName,
          customerAddress: invoice.customerAddress,
          customerMobile: invoice.customerMobile,
          partyGSTNo: invoice.partyGSTNo,
          products: invoice.products.map(p => ({
            name: p.name,
            description: p.description,
            quantity: p.quantity,
            rate: p.rate,
            amount: p.amount,
            cgst: p.cgst,
            sgst: p.sgst
          }))
        })
      });

      // Handle different response scenarios
      if (response.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token'); // Clear invalid token
        router.push('/login');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        console.log('Invoice created successfully:', data);
        router.push('/invoices'); // Redirect to invoices list
      } else {
        console.error('Failed to create invoice:', data.error || 'Unknown error');
        alert(`Failed to create invoice: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('An error occurred while creating the invoice');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      
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
          <h1 className="text-xl font-semibold">New Invoice</h1>
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
            * Customer Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder="Enter customer name"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Customer Mobile
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.customerMobile}
            onChange={(e) => handleInputChange('customerMobile', e.target.value)}
            placeholder="Enter mobile number"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Party GST No
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.partyGSTNo}
            onChange={(e) => handleInputChange('partyGSTNo', e.target.value)}
            placeholder="Enter GST number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Customer Address
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.customerAddress}
            onChange={(e) => handleInputChange('customerAddress', e.target.value)}
            placeholder="Enter customer address"
            rows={3}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Note
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={invoice.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            placeholder="Add any notes"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-red-500">
            * Invoice Date
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={invoice.invoiceDate}
              onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
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
            * Due Date
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={invoice.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2 font-medium">Product Name</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium">Quantity</th>
                <th className="pb-2 font-medium">Rate</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">CGST (9%)</th>
                <th className="pb-2 font-medium">SGST (9%)</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {invoice.products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      placeholder="Product Name"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={product.description}
                      onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={product.quantity || ''}
                      onChange={(e) => updateProduct(product.id, 'quantity', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-3 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={product.rate || ''}
                        onChange={(e) => updateProduct(product.id, 'rate', Number(e.target.value))}
                      />
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={product.amount.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={product.cgst.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={product.sgst.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <button 
                      onClick={() => removeProduct(product.id)}
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
          onClick={addProduct}
          className="mt-4 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 px-4 w-full flex items-center justify-center hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Product
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
          Save Invoice
        </button>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 mr-4">Sub Total :</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 pl-6 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={invoice.totalAmount.toFixed(2)}
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700 mr-4">CGST (9%) :</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 pl-6 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={invoice.cgstAmount.toFixed(2)}
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700 mr-4">SGST (9%) :</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 pl-6 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={invoice.sgstAmount.toFixed(2)}
                readOnly
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium mr-4">Total :</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 pl-6 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold"
                value={invoice.totalAfterTax.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}