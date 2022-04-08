import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { baseUrl } from "../lib/constant";
import { useNavigate } from "react-router";
import Home from "./Home";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Input,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

function AddClothes() {
  const navigation = useNavigate();
  axios.defaults.baseURL = baseUrl;

  const { getAccessTokenSilently } = useAuth0();

  const [base64, setBase64] = useState(null);
  const postClothings = async (e) => {
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
        .post("/api/clothings", {
          Title: [document.getElementById("title").value],
          Description: [document.getElementById("description").value],
          Image: [image],
          ImageType: [imageType],
          Tags: selectedTags.map((t) => t.id),
        })
        .then((response) => {
          navigation("/ListClothes");
          toast.success("Clothing added successfully");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const postTag = async (e) => {
    var tag = document.getElementById("tag").value;
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .post("/api/tags", {
          Title: tag,
        })
        .then((response) => {
          setTags([...tags, response.data]);
          toast.success("Tag added successfully");
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

  const [isTagInputOpen, setTagInputOpen] = useState(false);
  const [loading, setLoading] = useState(isTagInputOpen);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const getTags = async (e) => {
    try {
      const token = await getAccessTokenSilently();
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .get("/api/tags")
        .then((response) => {
          setLoading(false);
          setTags(response.data);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
        });
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    let active = true;
    if (!isTagInputOpen) {
      return undefined;
    }
    (async () => {
      if (active) {
        setLoading(true);
        await getTags();
      }
    })();
    return () => {
      active = false;
    };
  }, [isTagInputOpen]);

  return (
    <Box sx={{ paddingTop: 1 }}>
      <Divider>
        <b>Add new cloth</b>
      </Divider>
      <Container maxWidth="sm" sx={{ paddingBottom: 5 }}>
        {base64 && (
          <img
            src={base64}
            alt="selected image"
            style={{ margin: "auto auto" }}
          />
        )}
        <form onSubmit={postClothings}>
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
                Upload
              </Button>
            </label>
            <TextField
              margin="dense"
              required
              id="title"
              label="Title"
              variant="outlined"
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              variant="outlined"
            />
            <Autocomplete
              multiple
              open={isTagInputOpen}
              onOpen={() => {
                setTagInputOpen(true);
              }}
              onClose={() => {
                setTagInputOpen(false);
              }}
              onChange={(event, value) => {
                setSelectedTags(value);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.title}
              options={tags}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  {...params}
                  label="Tags"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <Button sx={{ mt: 2}} variant="contained" type="submit">
              Add
            </Button>
          </FormControl>
        </form>
      </Container>

      <Divider>
        <b>Add new tag</b>
      </Divider>

      <Container maxWidth="sm">
        <form onSubmit={postTag}>
          <FormControl fullWidth margin="normal">
            <TextField required id="tag" label="Tag" variant="outlined" />
            <Button sx={{ mt: 2}} variant="contained" type="submit">
              Add
            </Button>
          </FormControl>
        </form>
      </Container>
    </Box>
  );
}

export default withAuthenticationRequired(AddClothes, {
  onRedirecting: () => <Home />,
});
