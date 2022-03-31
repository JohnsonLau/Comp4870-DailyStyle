import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../lib/constant";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import CustomCard from "../components/CustomCard";
import Home from "./Home";

function ListClothes() {
  axios.defaults.baseURL = baseUrl;

  const { getAccessTokenSilently } = useAuth0();

  const [clothes, setClothes] = useState([]);
  const getClothings = async () => {
    try {
      const token = await getAccessTokenSilently();
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios
        .get("/api/clothings")
        .then((response) => {
          setClothes([...clothes, ...response.data]);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getClothings();
  }, []);

  return clothes == null ? (
    <div>Loading</div>
  ) : (
    <div className="mt-4 mx-4 flex flex-wrap gap-4 justify-center">
      {clothes.map((cloth) => (
        <CustomCard key={cloth.id} cloth={cloth} />
      ))}
    </div>
  );
}

export default withAuthenticationRequired(ListClothes, {
  onRedirecting: () => <Home />,
});
