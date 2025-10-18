export const ErrorPageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="grid place-items-center h-full p-4">
    <div className="max-w-lg w-full">{children}</div>
  </div>
);
