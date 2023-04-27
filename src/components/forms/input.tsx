import React from 'react';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<'input'>
>(({ className, ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded border border-gray-500 bg-gray-800 p-2 text-white hover:bg-gray-500 focus:outline-none ${className}`}
      {...rest}
    />
  );
});
