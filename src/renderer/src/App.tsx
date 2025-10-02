import { Admin, ListGuesser } from "./components/admin";
import { Resource } from "ra-core";
import './index.css'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Admin>
      <Resource name="pods" list={ListGuesser} />
    </Admin>
  )
}

export default App
