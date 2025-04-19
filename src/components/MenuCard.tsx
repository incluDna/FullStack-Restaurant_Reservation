export default function MenuCard({ image, name, price, description, onEdit, onDelete }) {
    return (
      <div className="w-64 bg-white rounded-xl shadow-md p-4 flex flex-col items-center relative">
        <img
          src={image}
          alt={name}
          className="w-32 h-32 object-cover rounded-full border-4 border-orange-400 mb-4"
        />
        <h3 className="text-lg font-semibold text-center">{name}</h3>
        <p className="text-orange-500 font-bold text-sm mb-2">{price} ฿</p>
        <p className="text-sm text-gray-600 text-center line-clamp-3">{description}</p>
  
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={onEdit} className="w-5 h-5 bg-orange-400 rounded"></button>
          <button onClick={onDelete} className="w-5 h-5 bg-orange-500 rounded"></button>
        </div>
      </div>
    );
  }
  