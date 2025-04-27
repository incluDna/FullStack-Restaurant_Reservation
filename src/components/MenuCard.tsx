'use client'
import { useEffect, useState } from "react";
import { Menu, MenuJSON } from "../../interfaces";
import editMenu from "@/libs/editMenu";
import getMenu from "@/libs/getMenu";
import deleteMenu from "@/libs/deleteMenu";
import { useNotice } from "./NoticeContext";

export default function MenuCard({ menu, role, token }: { menu: Menu, role: string | null, token: string | null }) {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [menuData, setMenuData] = useState<any>(menu);
  const { showNotice } = useNotice();

  const handleSave = async () => {
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
        showNotice("Menu deleted successfully");
        location.reload();
      } else {
        console.error("Failed to delete restaurant:", response.error);
        showNotice("Failed to delete restaurant");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      showNotice("An error occurred while deleting the restaurant. Please try again.");
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      const menuResponse: MenuJSON = await getMenu(menuData.restaurant, menuData._id);
      setMenuData(menuResponse.data);

    }
    if (!isEditable) fetchMenu();
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
              className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
            />
          ) : (`${menuData.name}`)
        }</h3>
      <p className="text-orange-500 font-bold text-sm">{
        isEditable ? (
          <input
            type="number"
            value={menuData.price}
            onChange={(e) => setMenuData({ ...menuData, price: e.target.value })}
            className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
          />
        ) :
          (`${menuData.price} ฿`)}
      </p>
      <p className="text-sm text-gray-600 text-center">{
        isEditable ? (
          <input
            type="text"
            value={menuData.description}
            onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
            className="w-full text-base text-black border-b-2 border-gray-300 focus:outline-none"
          />
        ) :
          (`${menuData.description}`)}</p>
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
            )}  </div>
        )}
    </div>
  );
}
