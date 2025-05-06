"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/sidebar";
import { format } from 'date-fns';

// Define types
type Product = {
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  cgst: number;
  sgst: number;
};

type Invoice = {
  id: number;
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  partyGSTNo: string;
  date: string;
  products: string; // JSON string of products
  totalAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAfterTax: number;
  createdAt: string;
  updatedAt: string;
  status?: string; // Derived field
};

export default function ViewInvoice({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login'); // Redirect to login page if not authenticated
        return;
      }

      const response = await fetch(`http://localhost:5000/api/invoice/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token'); // Clear invalid token
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setInvoice(data);
      
      // Parse the products JSON string
      if (data.products) {
        try {
          const parsedProducts = JSON.parse(data.products);
          setProducts(parsedProducts);
        } catch (err) {
          console.error('Failed to parse products JSON:', err);
          setProducts([]);
        }
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch invoice:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Determine invoice status based on date (example logic)
  const determineStatus = () => {
    if (!invoice || !invoice.date) return 'Draft';
    
    const invoiceDate = new Date(invoice.date);
    const currentDate = new Date();
    
    // Example: If invoice date is older than 30 days, mark as overdue
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    if (currentDate.getTime() - invoiceDate.getTime() > thirtyDaysInMs) {
      return 'Overdue';
    }
    
    // You might want to implement more sophisticated status logic here
    // return 'Pending';
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (err) {
      return dateString; // Return as is if format fails
    }
  };

  // Get status class for styling
  const getStatusClass = (status: string) => {
    if (!status) return '';
    
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/invoices/${params.id}/edit`);
  };

  // Determine status for the invoice
  const status = invoice ? determineStatus() : '';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden when printing */}
      <div className="w-64 bg-white shadow-sm print:hidden">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {/* Action Buttons - hidden when printing */}
          <div className="flex items-center justify-between mb-6 print:hidden">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Invoices
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Invoice
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Print Invoice
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">Loading invoice...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-500 mb-3">Error: {error}</p>
              <button 
                onClick={fetchInvoice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : invoice ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                  <p className="text-gray-500">#{invoice.id}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
                    {status}
                  </span>
                </div>
              </div>

              {/* Customer and Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-700 mb-3">Bill To:</h2>
                  <p className="font-medium text-gray-800">{invoice.customerName}</p>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.customerAddress}</p>
                  <p className="text-gray-600 mt-2">Phone: {invoice.customerMobile}</p>
                  {invoice.partyGSTNo && (
                    <p className="text-gray-600">GST No: {invoice.partyGSTNo}</p>
                  )}
                </div>
                <div className="md:text-right">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-500">Invoice Date:</p>
                    <p className="text-gray-800 md:text-right">{formatDate(invoice.date)}</p>
                    
                    <p className="text-gray-500">Created At:</p>
                    <p className="text-gray-800 md:text-right">{formatDate(invoice.createdAt)}</p>
                    
                    <p className="text-gray-500">Invoice Status:</p>
                    <p className="text-gray-800 md:text-right">{status}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              {products.length > 0 ? (
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Item</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Rate</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-4 text-sm text-gray-800">{product.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-800">{product.description}</td>
                          <td className="px-4 py-4 text-sm text-gray-800 text-right">{product.quantity}</td>
                          <td className="px-4 py-4 text-sm text-gray-800 text-right">
                            {formatCurrency(product.rate)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 text-right">
                            {formatCurrency(product.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded text-center">
                  <p className="text-gray-500">No products found for this invoice</p>
                </div>
              )}

              {/* Invoice Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-full md:w-1/2 lg:w-1/3">
                    <div className="flex justify-between py-2">
                      <p className="text-gray-600">Subtotal:</p>
                      <p className="text-gray-800 font-medium">{formatCurrency(invoice.totalAmount || 0)}</p>
                    </div>
                    {(invoice.cgstAmount > 0 || invoice.sgstAmount > 0) && (
                      <>
                        <div className="flex justify-between py-2">
                          <p className="text-gray-600">CGST:</p>
                          <p className="text-gray-800">{formatCurrency(invoice.cgstAmount || 0)}</p>
                        </div>
                        <div className="flex justify-between py-2">
                          <p className="text-gray-600">SGST:</p>
                          <p className="text-gray-800">{formatCurrency(invoice.sgstAmount || 0)}</p>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                      <p className="text-gray-800 font-medium">Total:</p>
                      <p className="text-gray-900 font-bold">{formatCurrency(invoice.totalAfterTax || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes or Terms (if available) */}
              {/* Additional sections can be added here */}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-500">Invoice not found</p>
              <button 
                onClick={handleGoBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
              >
                Back to Invoice List
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}