export const Badge = ({ title = '', value = '', total = '', textColor = '', bgColor = '' }: any) => {
  return (
    <div
      className={`flex flex-col w-full py-1 text-center text-base rounded-lg border`}
      style={{ color: textColor, background: bgColor, borderColor: textColor }}
    >
      <div className="flex flex-col mx-auto">
        <p className={`border-b`} style={{ borderColor: textColor }}>
          {value}
        </p>
        <p>{total}</p>
      </div>
      <p className="text-sm">{title}</p>
    </div>
  );
};
