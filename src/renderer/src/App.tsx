import { Admin } from "./components/admin";
import { Resource } from "ra-core";
import { authProvider } from "./lib/authProvider";
import { dataProvider } from "./lib/dataProvider";
import { PodsList } from "./components/resources/PodsList";
import { PodShow } from "./components/resources/PodShow";
import { PodEdit } from "./components/resources/PodEdit";

function App(): React.JSX.Element {
  return (
    <Admin 
      authProvider={authProvider}
      dataProvider={dataProvider}
      title="KubeMon - Kubernetes Dashboard"
    >
      <Resource 
        name="pods" 
        list={PodsList} 
        show={PodShow}
        edit={PodEdit}
      />
    </Admin>
  )
}

export default App
