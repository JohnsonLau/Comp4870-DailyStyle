import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { baseUrl } from "../lib/constant";
import { useNavigate } from "react-router";
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    FormControl,
    Input,
    MenuItem,
    Select,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useLocation } from "react-router-dom";
import Home from "./Home";

function EditCloth() {
    const navigation = useNavigate();
    axios.defaults.baseURL = baseUrl;

    const { getAccessTokenSilently } = useAuth0();

    const location = useLocation();
    const id = location.pathname.split("/").pop();

    useEffect(() => {
        getClothings();
    }, []);

    const getClothings = async (e) => {
        try {
            const token = await getAccessTokenSilently();
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios
                .get(`/api/clothings/${id}`)
                .then(async (response) => {
                    loadClothImage(response);
                    loadTitle(response);
                    loadDescription(response);
                    await getTags(response);
                });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const loadClothImage = (response) => {
        let imageType = response.data.imageType;
        let image = response.data.image;
        let imageComplete = imageType + "," + image;
        setBase64(imageComplete);
    };

    const loadTitle = (response) => {
        let title = response.data.title;
        document.getElementById("title").value = title;
    };

    const loadDescription = (response) => {
        let description = response.data.description;
        document.getElementById("description").value = description;
    };

    const [base64, setBase64] = useState(null);
    const putClothings = async (e) => {
        e.preventDefault();
        let imageType = "";
        let image = "";
        if (base64 !== null) {
            imageType = base64.split(",")[0];
            image = base64.split(",")[1];
        }

        try {
            const token = await getAccessTokenSilently();
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios
                .put(`/api/clothings/${id}`, {
                    Title: [document.getElementById("title").value],
                    Description: [document.getElementById("description").value],
                    Image: [image],
                    ImageType: [imageType],
                    Tags: selectedTags.map((t) => t.id),
                })
                .then((response) => {
                    navigation(`/ListClothes`);
                    toast.success("Clothing edited successfully");
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const [fileState, setFileImage] = useState(null);

    useEffect(() => {
        if (setFileImage == null) {
            return undefined;
        }
        (async () => {
            setBase64(await convertBase64(fileState));
        })();
    }, [fileState]);

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const getTags = async (response) => {
        var selected = response.data.tags;
        try {
            const token = await getAccessTokenSilently();
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await axios
                .get("/api/tags")
                .then((response) => {
                    setTags(response.data);
                    setSelectedTags(response.data.filter(t => (selected.map(s => s.id).includes(t.id))));
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Box sx={{ paddingTop: 1 }}>
            <Divider>
                <b>Edit Clothes</b>
            </Divider>
            <Container maxWidth="sm" sx={{ paddingBottom: 5 }}>
                {base64 && (
                    <img
                        src={base64}
                        alt="selected image"
                        style={{ margin: "auto auto" }}
                    />
                )}
                <form onSubmit={putClothings}>
                    <FormControl fullWidth margin="normal">
                        <label htmlFor="icon-button-file">
                            <Input
                                accept="image/*"
                                id="icon-button-file"
                                type="file"
                                onChange={(event) => {
                                    setFileImage(event.target.files[0]);
                                }}
                                sx={{ display: "none" }}
                            />

                            <Button
                                sx={{ mb: 1}}
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                variant="outlined"
                                startIcon={<PhotoCamera />}
                                fullWidth
                            >
                                Edit Image
                            </Button>
                        </label>
                        <TextField
                            margin="dense"
                            required
                            id="title"
                            label="Title"
                            variant="outlined"
                            focused
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            variant="outlined"
                            focused
                        />
                        <Select
                            sx={{ mt: 1}}
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
                        <Button sx={{ mt: 2}} variant="contained" type="submit">
                            Edit
                        </Button>
                    </FormControl>
                </form>
            </Container>
        </Box>
    );
}
export default withAuthenticationRequired(EditCloth, {
    onRedirecting: () => <Home />,
});
