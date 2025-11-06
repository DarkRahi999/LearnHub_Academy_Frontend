interface IProps {
  title?: string;
}

const AccessDenied = ({ title }: IProps) => {
  return (
    <>
      <div className="flex justify-center items-center h-[380px]">
        <div className="text-lg text-red-500">{title || "Access Denied"}</div>
      </div>
    </>
  );
};

export default AccessDenied;
