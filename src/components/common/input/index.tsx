import React, {
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  forwardRef,
} from 'react';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} className="border border-gray-200" {...props} />;
});

Input.displayName = 'Input';

export default Input;
