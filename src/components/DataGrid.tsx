interface DataGridProps {
  data: {
    id: string;
    image: string;
    title: string;
    description?: string;
  }[];
  type: "link" | "button";
  handler: Function;
}

const DataGrid = ({ data, type, handler }: DataGridProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-6">
      {data.map((item, index) => (
        <div
          className="hover:bg-dark-hovered p-2 rounded-md cursor-pointer group"
          key={item.id}
          onClick={() => {
            handler(item.id);
          }}
        >
          <div className="top relative">
            <img src={item.image} alt="image" className="rounded-lg" />

            <div className="h-10 w-10 border rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="#fff"
                  d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"
                />
              </svg>
            </div>
          </div>
          <div className="bottom text-center text-white">
            <p>{item.title}</p>
            {!!item.description && <p>{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataGrid;
