import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container, Box, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const FoundForm = () => {
  const { token } = useSelector((state) => state.auth);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8880/found/create",
        { description, location },  
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResponseMessage(response.data.message);
      setSnackbarSeverity("success");
    } catch (error) {
      setResponseMessage(error?.response?.data?.message);
      setSnackbarSeverity("error");
    } finally {
      setIsSubmitting(false);
      setOpenSnackbar(true);
      setDescription(""); 
      setLocation("");  
    }
  };

  return (
    <Container maxWidth="sm" >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 3,
          p: 4,
          borderRadius: 2,
          mt: 10,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom className="text-black">
           Post a found Item
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
            
          />
          
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 3 }}
            
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
            {responseMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
export default FoundForm;
