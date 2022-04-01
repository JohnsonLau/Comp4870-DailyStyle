import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { baseUrl } from "../lib/constant";
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    MenuItem,
    Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomCard from "../components/CustomCard";
import Landing from "./Landing";

function Home() {
    axios.defaults.baseURL = baseUrl;
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const getTags = async (e) => {
        try {
            const token = await getAccessTokenSilently();
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await axios
                .get("/api/tags")
                .then((response) => {
                    setTags(response.data);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } catch (error) {
            toast.error(error.message);
        }
    };
    useEffect(async () => {
        if (isAuthenticated) {
            await getTags();
        }
    }, [isAuthenticated]);
    useEffect(() => {
        setSelectedTags(tags);
    }, [tags]);

    const [clothes, setClothes] = useState([]);

    const getClothings = async (e) => {
      var tagIds = selectedTags.map((tag) => tag.id);
      const token = await getAccessTokenSilently();
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .put("/api/clothings/random", {
            Tags: tagIds,
        })
        .then((response) => {
          setClothes([...response.data]);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <Box sx={{ paddingTop: 1 }}>
                        <Divider>
                            <b>Today's Style</b>
                        </Divider>
                        <Grid
                            container
                            direction="column"
                            gap={2}
                            spacing={0}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Select
                                multiple
                                value={selectedTags}
                                onChange={(event) => {
                                    const {
                                        target: { value },
                                    } = event;
                                    setSelectedTags(value);
                                }}
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip
                                                key={value.id}
                                                label={value.title}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {tags.map((tag) => {
                                    return (
                                        <MenuItem key={tag.id} value={tag}>
                                            {tag.title}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                            <Button variant="contained" onClick={getClothings}>Generate</Button>

                            {clothes.map((cloth) => (
                                <CustomCard key={cloth.id} cloth={cloth} clothes={clothes} setClothes={setClothes}/>
                            ))}
                        </Grid>
                    </Box>
                </div>
            ) : (
                <Landing/>
            )}
        </div>
    );
}

export default Home;
