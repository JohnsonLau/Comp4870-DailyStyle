import { useEffect, useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActions, CardActionArea, Button, Chip } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { pink } from "@mui/material/colors";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { baseUrl } from "../lib/constant";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { spacing } from '@mui/system';

export default function CustomCard({ cloth }) {
  const [id, title, description, image, imageType, tags, isFavorite] = [
    cloth.id,
    cloth.title ? cloth.title : "No Title",
    cloth.description ? cloth.description : "No Description",
    cloth.image,
    cloth.imageType,
    cloth.tags,
    cloth.isFavorite,
  ];

  useEffect(() => {
    console.log(cloth);
    }, [cloth]);

  const { getAccessTokenSilently } = useAuth0();
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);
  const handleFavorite = async () => {
    let newIsFavorite = !isFavoriteState;
    try {
      const token = await getAccessTokenSilently();
      axios.baseUrl = baseUrl;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .put("/api/clothings/fav/" + id, {
          isFavorite: newIsFavorite,
        })
        .then(() => {
          setIsFavoriteState(newIsFavorite);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigation = useNavigate();
  const handleEdit = () => {
      navigation(`/EditCloth/${id}`);
  }

  return (
    <Card sx={{ maxWidth: 345, width: "100%", height: "100%" }}>
      <CardActionArea 
        onClick={handleEdit}>
        <CardMedia
          component="img"
          image={imageType + "," + image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          {
            cloth.tags && cloth.tags.map((tag) => {
              return (
                <Chip label={tag.title}/>
              )
            })
          }
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
          <IconButton onClick={handleFavorite}>
              {
                    isFavoriteState ?
                    <FavoriteIcon sx={{color: pink[500]}}/> :
                    <FavoriteIcon />
              }
          </IconButton>
          <Button
            sx={{ ml: "auto"}}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
      </CardActions>
    </Card>
  );
}
