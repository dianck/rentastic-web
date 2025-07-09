export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="rounded-xl shadow p-4 bg-white" {...props}>{children}</div>;
}

export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="mt-2" {...props}>{children}</div>;
}
