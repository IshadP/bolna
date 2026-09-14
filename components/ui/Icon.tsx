import React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  className?: string;
  fill?: boolean;
}

export function Icon({
  name,
  size = 20,
  className = "",
  fill = false,
  ...props
}: IconProps) {
  return (
    <span
      className={`material-symbols-rounded select-none shrink-0 leading-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
