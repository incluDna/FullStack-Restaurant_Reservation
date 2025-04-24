'use client'
import { useEffect, useState } from "react";
import { Menu, MenuJSON } from "../../interfaces";
import editMenu from "@/libs/Menu/editMenu";
import getMenu from "@/libs/Menu/getMenu";
import deleteMenu from "@/libs/Menu/deleteMenu";

export default function MenuCard({ menu, role, token }: { menu: Menu, role: string | null, token: string | null }) {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [menuData, setMenuData] = useState<any>(menu);
  const [warning, setWarning] = useState<string>("");
  const [emptyFields, setEmptyFields] = useState<{ name: boolean; price: boolean; description: boolean }>({
    name: false,
    price: false,
    description: false,
  });

  const handleSave = async () => {
    const isNameEmpty = !menuData.name?.trim();
    const isPriceEmpty = menuData.price === "" || menuData.price === null;
    const isDescEmpty = !menuData.description?.trim();
    const isDescTooLong = menuData.description?.length > 300;

    if (isNameEmpty || isPriceEmpty || isDescEmpty || isDescTooLong) {
      const missingFields = [];
      if (isNameEmpty) missingFields.push("name");
      if (isPriceEmpty) missingFields.push("price");
      if (isDescEmpty) missingFields.push("description");

      let warningMsg = "";
      if (missingFields.length > 0) {
        warningMsg += "Please fill: " + missingFields.join(", ");
      }
      if (isDescTooLong) {
        warningMsg += (warningMsg ? ". " : "") + "Description must be less than or equal to 300 characters.";
      }

      setWarning(warningMsg);
      setEmptyFields({
        name: isNameEmpty,
        price: isPriceEmpty,
        description: isDescEmpty || isDescTooLong,
      });
      return;
    }

    try {
      const updatedFields = {
        name: menuData?.name,
        price: menuData?.price,
        description: menuData?.description
      };

      if (!menuData || !token) {
        console.error("Missing menu or authentication token");
        return;
      }

      await editMenu(token, menuData?.restaurant, updatedFields, menuData._id);

      const menuResponse: MenuJSON = await getMenu(menuData.restaurant, menuData._id);
      setMenuData(menuResponse.data);
      setIsEditable(false);
      setWarning("");
      setEmptyFields({ name: false, price: false, description: false });
    } catch (error) {
      console.error("Error saving restaurant data:", error);
    }
  };

  const handleDelete = async () => {
    if (!menuData || !token) {
      console.error("Missing menu or authentication token");
      return;
    }

    try {
      const response = await deleteMenu(token, menuData.restaurant, menuData._id);

      if (response.success) {
        alert("Menu deleted successfully");
        location.reload();
      } else {
        console.error("Failed to delete restaurant:", response.error);
        alert("Failed to delete restaurant");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("An error occurred while deleting the restaurant. Please try again.");
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      const menuResponse: MenuJSON = await getMenu(menuData.restaurant, menuData._id);
      setMenuData(menuResponse.data);
    };
    if (!isEditable) {
      fetchMenu();
      setWarning("");
      setEmptyFields({ name: false, price: false, description: false });
    }
  }, [isEditable]);

  return (
    <div className="w-64 bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
      <img src={menuData.picture} className="w-32 h-32 object-cover rounded-full border-4 border-orange-400 mb-4" />
      <h3 className="text-lg font-semibold text-center">
        {
          isEditable ? (
            <input
              type="text"
              value={menuData.name}
              onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
              className={`w-full text-base text-black border-b-2 focus:outline-none ${emptyFields.name ? "border-red-500" : "border-gray-300"}`}
            />
          ) : (`${menuData.name}`)
        }</h3>
      <p className="text-orange-500 font-bold text-sm">{
        isEditable ? (
          <input
            type="number"
            value={menuData.price}
            onChange={(e) => setMenuData({ ...menuData, price: e.target.value })}
            className={`w-full text-base text-black border-b-2 focus:outline-none ${emptyFields.price ? "border-red-500" : "border-gray-300"}`}
          />
        ) :
          (`${menuData.price} ฿`)}</p>
      <p className="text-sm text-gray-600 text-center">{
        isEditable ? (
          <input
            type="text"
            value={menuData.description}
            onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
            className={`w-full text-base text-black border-b-2 focus:outline-none ${emptyFields.description ? "border-red-500" : "border-gray-300"}`}
          />
        ) :
          (`${menuData.description}`)}</p>
      {
        isEditable && warning && <p className="text-red-500 text-sm mt-2">{warning}</p>
      }
      {
        (role === 'admin' || role === 'employee') && (
          <div className="flex justify-center gap-2 mt-4">
            {(isEditable) && (
              <>
                <button onClick={handleSave} className="w-20 h-5 bg-orange-400 rounded">Save</button>
                <button onClick={() => setIsEditable(false)} className="w-20 h-5 bg-orange-500 rounded">Cancel</button>
              </>
            )}
            {(!isEditable) && (
              <>
                <button onClick={() => setIsEditable(true)} className="w-20 h-5 bg-orange-400 rounded">Edit</button>
                <button onClick={handleDelete} className="w-20 h-5 bg-orange-500 rounded">Delete</button>
              </>
            )}
          </div>
        )
      }
    </div>
  );
}