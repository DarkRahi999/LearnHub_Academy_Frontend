interface IProps {
  title?: string;
}

const AccessDenied = ({ title }: IProps) => {
  return (
    <>
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">{title || "Access Denied"}</div>
      </div>
    </>
  );
};

export default AccessDenied;
