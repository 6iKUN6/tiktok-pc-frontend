import { Fragment, useEffect } from 'react';

import { useBaseStore } from '@/store';
import Router from '@/routes';

function App() {
  const { init } = useBaseStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Fragment>
      <Router />
    </Fragment>
  );
}

export default App;
