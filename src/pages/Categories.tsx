import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import DataGrid from "../components/DataGrid";
import Loader from "../components/Loader";
import { getCategoryInfo } from "../services/categories";

const Categories = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error } = useSWR(`category-${id}`, () =>
    getCategoryInfo(id as string)
  );

  if (!!error) return <div>Error</div>;

  if (!data) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl mt-5 mb-3 text-white">Playlists</h1>
      <DataGrid
        data={data.playlists.items.map((item) => ({
          id: item.id,
          image: item?.images?.[0]?.url,
          title: item.name,
          description: item?.owner?.display_name,
        }))}
        type="link"
        handler={(id: string) => {
          navigate(`/playlist/${id}`);
        }}
      />
    </div>
  );
};

export default Categories;
