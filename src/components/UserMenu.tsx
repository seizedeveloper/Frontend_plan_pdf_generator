import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user?.name) return null;

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center text-brand-700 font-medium"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow z-10">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.name}</div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
