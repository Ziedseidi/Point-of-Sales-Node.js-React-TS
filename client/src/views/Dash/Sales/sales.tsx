import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import ProductTable from '../../../components/forms/TableDynamic';
import { FaEllipsisV, FaEye, FaEdit, FaTrash, FaFilePdf,FaDollarSign,FaShoppingCart,FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Sales: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<null | number>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const menuRefs = useRef<Array<HTMLDivElement | null>>([]);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleMenuToggle = (index: number) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    // Ajoutez ici votre logique pour filtrer les données par date.
    console.log('Selected date:', date);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'REFERENCE',
        accessor: 'reference',
        Cell: ({ value }: { value: string }) => (
          
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {value}
            </span>
          
        ),
      },
      {
        Header: 'CUSTOMER',
        accessor: 'customer',
      },
      {
        Header: 'WAREHOUSE',
        accessor: 'warehouse',
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => (
          <span className="bg-yellow-200 text-orange-500 px-2 py-1 rounded">
            {value}
          </span>
        ),
      },
      {
        Header: 'GRAND TOTAL',
        accessor: 'grandTotal',
      },
      {
        Header: 'PAID',
        accessor: 'paid',
      },
      
      {
        Header: 'PAYMENT STATUS',
        accessor: 'paymentStatus',
        Cell: ({ value }: { value: string }) => (
          
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {value}
            </span>
        
        ),
      },
      {
        Header: 'PAYMENT TYPE',
        accessor: 'paymentType',
        Cell: ({ value }: { value: string }) => (
          
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {value}
            </span>
        
        ),
      },
      {
        Header: 'CREATED ON',
        accessor: 'createdOn',
        Cell: ({ value }: { value: string }) => (
          <span className="text-center text-blue-500 bg-blue-100 px-2 py-1 rounded w-auto min-w-[150px]">
            {value}
          </span>
        ),
      },
      
      
      {
        Header: 'ACTION',
        accessor: 'action',
        Cell: ({ row }: { row: any }) => (
          <div className="relative">
            <button
              ref={(el) => (buttonRefs.current[row.index] = el)}
              onClick={() => handleMenuToggle(row.index)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200"
            >
              <FaEllipsisV className="h-5 w-5" />
            </button>
            {openMenu === row.index &&
              ReactDOM.createPortal(
                <div
                  ref={(el) => (menuRefs.current[row.index] = el)}
                  className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  style={{
                    top:
                      (buttonRefs.current[row.index]?.getBoundingClientRect().bottom ?? 0) + window.scrollY,
                    left:
                      (buttonRefs.current[row.index]?.getBoundingClientRect().left ?? 0) + window.scrollX,
                  }}
                >
                  <button
                    onClick={() => handleView(row.original)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaEye />
                    <span>View Sale</span>
                  </button>
                  <button
                    onClick={() => handleDownload(row.original)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaFilePdf />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => handleCreatePayment(row.original)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaDollarSign />
                    <span>Create Payment </span>
                  </button>
                  <button
                    onClick={() => handleCreateSaleReturn(row.original)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaEye />
                    <span>Create Sale Return </span>
                  </button>
                  
                  
                  <button
                    onClick={() => handleUpdate(row.original)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaEdit />
                    <span>Edit Purshase Return</span>
                  </button>
                  <button
                    onClick={() => handleDelete(row.original)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>Delete Purshase Return</span>
                  </button>
                </div>,
                document.body
              )}
          </div>
        ),
      },
    ],
    [openMenu]
  );

  const data = React.useMemo(
    () => [
      {
        reference: 'AD_119',
        customer: 'Firas',
        warehouse: 'Warehouse7',
        status: 'Sent',
        grandTotal: 1000,
        paid:500,
        paymentStatus:"PAID",
        paymentType:"cache",
        createdOn: '2024-08-17 11:37 PM',
      },
      // Ajoutez plus de données ici...
    ],
    []
  );

  const handleView = (product: any) => {
    console.log('View', product);
    // Ajouter la logique pour visualiser la citation
  };

  const handleDownload = (product: any) => {
    console.log('Download', product);
    // Ajouter la logique pour télécharger en PDF
  };
  const handleCreatePayment = (product: any) => {
    console.log('Download', product);
    // Ajouter la logique pour télécharger en PDF
  };
  const handleCreateSaleReturn = (product: any) => {
    console.log('Download', product);
    // Ajouter la logique pour télécharger en PDF
  };

    const handleUpdate = (product: any) => {
    console.log('Update', product);
    // Ajouter la logique pour éditer la citation
  };

  const handleDelete = (product: any) => {
    console.log('Delete', product);
    // Ajouter la logique pour supprimer la citation
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.243 4.243a1 1 0 01-1.414 1.414l-4.243-4.243zm-1.414 0A6 6 0 1111 5a6 6 0 010 12z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center border rounded-lg px-2 py-2">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select Date"
                className="px-2 py-1 focus:outline-none"
              />
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4">
            Create Purshase Return
          </button>
        </div>
        <div className="overflow-x-auto">
          <ProductTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Sales;