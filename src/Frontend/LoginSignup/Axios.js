import React from "react";
import axios, { Axios } from "axios";

function App() {
    const [column, setColumn]= useState([]);
    const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/LoginSignup.jsx")
      .then((res) => res.json())
      .then((data) => {
        setColumn(Object.keys(data.users[0]))
        setRecords(data.users)
    });
            
  }, []);

  return (
  <div>
    
  </div>
  )
}

export default Axios;
