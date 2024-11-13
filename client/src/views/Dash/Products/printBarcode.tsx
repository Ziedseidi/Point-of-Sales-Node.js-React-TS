import React, { useState } from "react";
import ProductTable from '../../../components/forms/TableDynamic';

const PrintBarcode = () => {
  const [warehouse, setWarehouse] = useState("");
  const [product, setProduct] = useState("");
  const [paperSize, setPaperSize] = useState("");
  const [showCompanyName, setShowCompanyName] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  const handleReset = () => {
    setWarehouse("");
    setProduct("");
    setPaperSize("");
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Product",
        accessor: "product",
      },
      {
        Header: "QTY",
        accessor: "qty",
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      // Example data; replace with actual product data
      
    ],
    []
  );

  return (
    <div className="p-5 font-sans mt-12">
      <div>
        <label className="block mb-2">
          Warehouse: <span className="text-red-500">*</span>
        </label>
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        >
          <option value="">Choose Warehouse</option>
          {/* Ajouter des options ici */}
        </select>
      </div>

      <div>
        <label className="block mb-2">Product:</label>
        <input
          type="text"
          placeholder="Search Product by Code Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />
      </div>

      {/* Utilisation du composant ProductTable ici */}
      <ProductTable columns={columns} data={data} />

      <div className="mt-4">
        <label className="block mb-2">
          Paper Size: <span className="text-red-500">*</span>
        </label>
        <select
          value={paperSize}
          onChange={(e) => setPaperSize(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-gray-300"
        >
          <option value="">Choose Paper size</option>
          {/* Ajouter des options ici */}
        </select>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <button className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600">
            Preview
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600"
          >
            Reset
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Print
          </button>
        </div>

        <div className="flex items-center">
          <ToggleButton
            label="Show Company Name"
            isEnabled={showCompanyName}
            toggle={() => setShowCompanyName(!showCompanyName)}
          />
          <ToggleButton
            label="Show Product Name"
            isEnabled={showProductName}
            toggle={() => setShowProductName(!showProductName)}
          />
          <ToggleButton
            label="Show Price"
            isEnabled={showPrice}
            toggle={() => setShowPrice(!showPrice)}
          />
        </div>
      </div>
    </div>
  );
};

const ToggleButton = ({ label, isEnabled, toggle }) => (
  <div className="mr-4 flex items-center">
    <button
      onClick={toggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
        isEnabled ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
          isEnabled ? "transform translate-x-6" : ""
        }`}
      />
    </button>
    <span className="ml-2">{label}</span>
  </div>
);

export default PrintBarcode;
