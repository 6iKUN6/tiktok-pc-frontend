import { useRoutes } from 'react-router-dom';

import { routerMap } from './routerMap';

function Router() {
  const routerTab = useRoutes(routerMap);
  return <div>{routerTab}</div>;
}

export default Router;
