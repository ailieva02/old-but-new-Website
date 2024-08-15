import React, { useEffect, useState } from "react";

function App() {
  const [usersResponse, setUsersResponse] = useState(null);
  const [singleUserResponse, setSingleUserResponse] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((usersResponse) => setUsersResponse(usersResponse))
      .catch((error) => console.error("Error fetching users:", error));

    fetch("http://localhost:5000/api/users/1")
      .then((response) => response.json())
      .then((singleUserResponse) => {
        if (
          singleUserResponse &&
          singleUserResponse.data &&
          singleUserResponse.data.length > 0
        ) {
          setSingleUserResponse(singleUserResponse.data[0]);
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Data from API:</h1>

      <div
        style={{
          padding: "0 0 0 10px",
          border: "3px solid black",
          float: "left",
          width: "40vw",
        }}
      >
        <h2>All Users</h2>
        {usersResponse ? (
          <ul>
            {usersResponse.data.map((user, i) => (
              <li key={i}>
                <p>
                  Name: <b> {user.name} </b>
                </p>
                <p>
                  Last Name: <b> {user.lastname} </b>
                </p>
                <p>
                  Username: <b> {user.username} </b>
                </p>
                <p>
                  Role: <b> {user.role} </b>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div
        style={{
          padding: "0 0 0 10px",
          border: "3px solid black",
          float: "right",
          width: "40vw",
        }}
      >
        <h2>Single User</h2>
        {singleUserResponse ? (
          <div>
            <p>
              Name: <b> {singleUserResponse.name} </b>
            </p>
            <p>
              Last Name: <b> {singleUserResponse.lastname} </b>
            </p>
            <p>
              Username: <b> {singleUserResponse.username} </b>
            </p>
            <p>
              Role: <b> {singleUserResponse.role} </b>
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
