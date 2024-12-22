import { FC, useRef } from 'react';

import Child from './child';

import { useTestStore } from '@/store';

const Test: FC = () => {
  const { add, subtract, count } = useTestStore();
  const age = useRef(0);
  const a = () => {
    age.current++;
    console.log('a', age.current);
  };

  const s = () => {
    age.current--;
    console.log('s', age.current);
  };

  return (
    <div>
      <div>
        <h3>
          test-zustand: <span>{count}</span>
        </h3>
        <button onClick={add}>+</button>
        <button onClick={subtract}>-</button>
      </div>
      <div>
        <Child name="child-comp" age={age.current} />
        <button onClick={a}>+</button>
        <button onClick={s}>-</button>
      </div>
    </div>
  );
};

export default Test;
