import { useState } from "react";
import Loader from "../../components/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import TableCard from "./components/Card.product";
import { useCreateProductMutation, useGetAllProductsQuery } from "../../provider/queries/Products.query";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';

const ProductsPage = () => {
  const [visible, setVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 1,
    category: "",
    image: ""
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const { data, isLoading, isError } = useGetAllProductsQuery({
    query: SearchParams.get("query") || "",
    page: Number(SearchParams.get("page")) || 1,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h1>Something went wrong</h1>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct((prev) => ({ ...prev, image: reader.result }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 1,
        category: "",
        image: ""
      });
      setVisible(false);
    } catch (error) {
      console.error("Error creating a product:", error);
    }
  };

  // Define the category options
  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Clothes", value: "clothes" },
    { label: "Home Appliances", value: "home-appliances" },
    { label: "Books", value: "books" },
    { label: "Toys", value: "toys" },
    { label: "Sports", value: "sports" }
  ];

  return (
    <>
      <div className="flex justify-end items-center w-[90%] mx-auto mb-4">
        <button
          onClick={() => setVisible(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
        >
          Add Product
        </button>
      </div>

      {visible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-[90%] max-w-lg relative">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <InputText
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full"
                required
              />
              <InputTextarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full"
              />
              <div className="flex flex-row">
                <p className="mt-5 mr-3 text-lg">Price</p>
                <InputNumber
                  name="price"
                  value={newProduct.price}
                  onValueChange={(e) => handleInputChange(e)}
                  placeholder="Price"
                  className="w-full p-2"
                  required
                />
              </div>

              <div className="flex flex-row">
                <p className="mt-5 mr-3 text-lg">Stock</p>
                <InputNumber
                  name="stock"
                  value={newProduct.stock}
                  onValueChange={(e) => handleInputChange(e)}
                  placeholder="Stock"
                  className="w-full p-2 text-lg"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-row">
                <p className="mt-5 mr-3 text-lg">Category</p>
                <Dropdown
                  name="category"
                  value={newProduct.category}
                  options={categories}
                  onChange={handleInputChange}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select a category"
                  className="w-full p-2 text-lg"
                  required
                />
              </div>

              <FileUpload
                name="image"
                onSelect={handleImageChange}
                accept="image/*"
                className="w-full"
                mode="basic"
              />
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  label="Cancel"
                  onClick={() => setVisible(false)}
                  className="bg-gray-500 p-3"
                />
                <Button
                  type="submit"
                  label={isCreating ? "Adding..." : "Add"}
                  disabled={isCreating}
                  className="bg-blue-500 p-3"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto shadow">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data && data.data.length > 0 && data.data.map((product: any, i: number) => (
              <TableCard key={i} id={i + 1} data={product} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductsPage;
