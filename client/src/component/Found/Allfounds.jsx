import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FoundItem from "./FoundItem";
import axios from "axios";

function Allfounds() {
  const { token } = useSelector((state) => state.auth);
  const [founds, Setfounds] = useState([]);

  useEffect(() => {
    const getAllfound = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8880/found/getAll",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Setfounds(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getAllfound();
  }, []);
  return (
    <div>
      <h1>All Found Items</h1>
      {founds.length === 0 ? (
        <p>No items found</p>
      ) : (
        <div className="flex  flex-wrap gap-[4%] mx-16 my-10">
          {/* <div className="w-[30%]"> */}
          {founds.map((found, index) => {
            return (
              <div className="w-[30%]">
              <FoundItem data={found}></FoundItem>
              </div>
              
            );
          })}
          </div>
        // </div>

      )}
    </div>
  );
}
export default Allfounds;
