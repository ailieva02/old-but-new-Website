import React, { useEffect, useState } from 'react';

function App() {
  const [usersResponse, setUsersResponse] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(usersResponse => setUsersResponse(usersResponse))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Data from API:</h1>
      {usersResponse 
      ? <ul>
          {usersResponse.data.map((user, i) => (
            <li>
              <div key={i}>
                <p>Name: <b> {user.name} </b></p>
                <p>Last Name: <b> {user.lastname} </b></p>
                <p>Username: <b> {user.username} </b></p>
                <p>Role: <b> {user.role} </b></p>
              </div>
            </li>
          ))}
        </ul> 
      : <p>Loading...</p>
    }

      {/* <button onClick>Create User</button> */}
    </div>
  );
}

export default App;
