import { ErrorMessage, Field, Formik } from 'formik'
import { Button, TextField, Typography, Box, Container, Paper } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useLoginUserMutation } from '../provider/queries/Auth.query.ts'
import { toast } from 'sonner'
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const [LoginUser, LoginUserResponse] = useLoginUserMutation()
  const navigate = useNavigate()

  type User = {
    token: string
    email: string
    password: string
  }

  const initialValues: User = {
    token: '',
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Email must be valid')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be greater than 6 characters')
      .required('Password is required')
  })

  const OnSubmitHandler = async (e: User, { resetForm }: any) => {
    try {
      const { data, error }: any = await LoginUser(e)
      if (error) {
        toast.error(error.data.message)
        return
      }

      localStorage.setItem('token', data.token)
      toast.success('Logged in Successfully', { duration: 1000 })

      resetForm()
      navigate('/home')
      console.log("going to reload")
      window.location.reload()
      console.log("reloaded")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <LoginIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 3
            }}
          >
            Login
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={OnSubmitHandler}
          >
            {({ values, handleSubmit }) => (
              <form
                onSubmit={handleSubmit}
                style={{
                  width: '100%',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Field
                    name="email"
                    type="email"
                    as={TextField}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    helperText={<ErrorMessage name="email" />}
                    error={!!values.email && !!values.email.length === 0}
                  />

                  <Field
                    name="password"
                    type="password"
                    as={TextField}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    required
                    helperText={<ErrorMessage name="password" />}
                    error={!!values.password && !!values.password.length === 0}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={LoginUserResponse.isLoading}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {LoginUserResponse.isLoading ? 'Logging in...' : 'Login'}
                  </Button>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 2 
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link 
                        to="/register" 
                        style={{ 
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          component="span"
                          sx={{ 
                            color: 'primary.main',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          Register
                        </Typography>
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
