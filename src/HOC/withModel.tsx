// 实现类似于vue的双向绑定

import React, { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';

interface ComponentProps {
  model: any;
  name?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

interface WithModelProps extends ComponentProps {
  ref?: ForwardedRef<any>; // 这里假设ref是指向任意类型的，你可以根据实际情况指定具体的类型
}

const withModel = <T extends ComponentProps>(Component: React.ComponentType<T>) =>
  forwardRef<any, WithModelProps>(
    ({ model, name, value, onChange, ...other }, outerRef: ForwardedRef<any>) => {
      const [modelValue, setModelValue] = useMemo(() => model, [model]);
      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          if (modelValue) {
            setModelValue(() => e.target.value);
          }

          onChange?.(e);
        },
        [onChange, modelValue, setModelValue],
      );

      return (
        <Component
          {...(other as T)}
          value={modelValue !== undefined ? modelValue : value}
          onChange={handleChange}
          ref={outerRef}
          name={name}
        />
      );
    },
  );

export default withModel;
