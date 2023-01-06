import { React, useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { ENDPOINT, ROOM_ID } from "./endpoints";

function JoinRoom() {
  const [username, setUsername] = useState("");
  const hmsActions = useHMSActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let selectedRole = "";
    if (username == "admin") {
      selectedRole = "broadcaster";
    } else {
      selectedRole = "hls-viewer";
    }
    const response = await fetch(`${ENDPOINT}api/token`, {
      method: "POST",
      body: JSON.stringify({
        user_id: `${Date.now()}`,
        role: selectedRole, //broadcaster, hls-viewer
        type: "app",
        room_id: ROOM_ID,
      }),
    });
    const { token } = await response.json();
    // Joining the room
    hmsActions.join({
      userName: username,
      authToken: token,
    });
  };

  return (
    <form className="join" onSubmit={handleSubmit}>
      <input
        type="text"
        required
        placeholder="Enter name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button>Join</button>
    </form>
  );
}

export default JoinRoom;
