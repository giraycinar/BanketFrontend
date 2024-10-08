import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useContext, useState} from "react"
import { AuthContext } from '../../context/AuthContext';
import { Alert, Snackbar } from '@mui/material';

export default function SignIn() {

  const {isAuthenticated,login} = useContext(AuthContext);
  const [loginError, setLoginError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email =  data.get('email');
    const pwd =  data.get('password');
    
    try{
      await login(email, pwd);
      if(isAuthenticated){
        setLoginError(false)
        setShowToast(false)
      } else{
        setLoginError(true)
        setShowToast(true)
      }
    }catch(error){
      setLoginError(true)
      setShowToast(true)
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {loginError && <div style={{ color: 'red', textSize: 'small' }}>Şifre veya e-mail adresi hatalıdır.Lütfen tekrar deneyiniz.</div>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar open={showToast} autoHideDuration={6000} onClose={() => setShowToast(false)}>
          <Alert onClose={() => setShowToast(false)} severity="error">
            Şifre veya e-mail adresi hatalıdır.Lütfen tekrar deneyiniz.
            </Alert>
        </Snackbar>
      </Container>
  );
}
