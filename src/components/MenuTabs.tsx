export default function MenuTabs({ current, onChange }) {
    const categories = ["dish", "drink", "set"];
  
    return (
      <div className="flex gap-4 justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`px-4 py-2 rounded-full ${
              current === cat ? "bg-orange-400 text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }
  