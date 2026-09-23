import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-2xl font-bold text-secondary">
        {user.firstName[0]}
        {user.lastName[0]}
      </span>
      <h1 className="mt-4 text-headline-md">
        {user.firstName} {user.lastName}
      </h1>
      <p className="text-sm text-on-surface-variant">{user.email}</p>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="btn-secondary mt-8"
      >
        <Icon name="logout" className="!text-base" /> Log Out
      </button>
    </div>
  );
}
