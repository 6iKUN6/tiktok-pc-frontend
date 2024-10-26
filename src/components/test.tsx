import { FC } from 'react';

import { useTestStore } from '@/store';

const Test: FC = () => {
  const { add, subtract, count } = useTestStore();
  return (
    <div>
      <h3>
        test-zustand: <span>{count}</span>
      </h3>
      <button onClick={add}>+</button>
      <button onClick={subtract}>-</button>
    </div>
  );
};

export default Test;
