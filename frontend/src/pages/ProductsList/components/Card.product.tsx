import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteProductMutation, useUpdateProductMutation } from "../../../provider/queries/Products.query";
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from "primereact/dropdown";

const TableCard = ({ data, id }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image ,
        category: data.category
    });

    const [deleteProduct] = useDeleteProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();


    const handleDelete = (id: string) => {
        deleteProduct(id);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(editForm);
        await updateProduct({ id: data._id, data: editForm });
        setIsEditing(false);
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
            {isEditing ? (
                <tr className="bg-white border-b">
                    <td colSpan={5} className="px-6 py-4">
                        <form onSubmit={handleFormSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleFormChange}
                                    placeholder="Name"
                                    className="border rounded px-4 py-2"
                                    required
                                />
                                <input
                                    type="number"
                                    name="price"
                                    value={editForm.price}
                                    onChange={handleFormChange}
                                    placeholder="Price"
                                    className="border rounded px-4 py-2"
                                    required
                                />
                                <input
                                    type="number"
                                    name="stock"
                                    value={editForm.stock}
                                    onChange={handleFormChange}
                                    placeholder="Stock"
                                    className="border rounded px-4 py-2"
                                    required
                                />
                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleFormChange}
                                    placeholder="Description"
                                    className="border rounded px-4 py-2"
                                />
                                <Dropdown
                                name="category"
                                value={editForm.category}
                                options={categories}
                                onChange={handleFormChange}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select a category"
                                className="w-full p-2 text-lg"
                                required
                                />
                                <FileUpload
                                    name="image"
                                    accept="image/*"
                                    onSelect={handleImageChange}
                                    className="w-full"
                                    mode="basic"
                                />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isUpdating}>
                                    {isUpdating ? "Updating..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </td>
                </tr>
            ) : (
                <tr className="bg-white border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {id}
                    </th>
                    <td className="px-6 py-4">
                        <Link to={`/product/${data._id}`} className="text-blue-500 hover:underline">
                            {data.name}
                        </Link>
                    </td>
                    <td className="px-6 py-4">&#8377;{data.price}</td>
                    <td className="px-6 py-4">{data.stock}</td>
                    <td className="px-6 py-4">
                        <button onClick={handleEditClick} className="text-blue-500 hover:underline mr-4">
                            Edit
                        </button>
                        <button onClick={() => handleDelete(data._id)} className="text-red-500 hover:underline">
                            Delete
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableCard;
