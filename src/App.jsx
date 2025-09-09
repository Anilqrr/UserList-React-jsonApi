import "./App.css";
//import UserList from "./components/UserList";
import UserTable from "./components/UserTable";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* <UserList /> */}
      <UserTable />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
