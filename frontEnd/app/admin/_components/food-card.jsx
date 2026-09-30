export const FoodCard = ({ price, ingredients, name }) => {
  return (
    <div className="border  rounded-2xl flex flex-col gap-5 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="border h-25 rounded-2xl"></div>
      <div className="flex items-start justify-between gap-2 p-1">
        <span className="font-semibold text-red-800">{name}</span>
        <p> {price}</p>
      </div>
      <p className="text-sm text-gray-500 line-clamp-3">{ingredients}</p>
    </div>
  );
};
