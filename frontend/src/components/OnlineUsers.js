import { useState } from 'react';
import '../mcss/OnlineUsersDropdown.css'; // CSS alag rakha hai

const OnlineUsersDropdown = ({ users }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="online-users-wrapper">
      <button onClick={() => setOpen(!open)} className="online-toggle-btn">
        👥 Online ({users.length})
      </button>

      {open && (
        <div className="online-dropdown">
          <h6 className="online-header">Online Users</h6>
          <ul className="online-users-list">
            {users.map((user) => (
              <li key={user.userId} className="online-user-item">
                <span className="online-dot" /> {user.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OnlineUsersDropdown;
