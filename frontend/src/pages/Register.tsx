import { ErrorMessage, Field, Formik } from 'formik'
import { Button, TextField, Typography, Box, Container } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useRegisterUserMutation } from '../provider/queries/Auth.query'
import { toast } from 'sonner'

const Register = () => {
  const [registerUser, registerUserResponse] = useRegisterUserMutation()
  const navigate = useNavigate()

  type User = {
    name: string
    email: string
    password: string
  }

  const initialValues: User = {
    name: '',
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
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
      const { data, error }: any = await registerUser(e)

      if (error) {
        toast.error(error.data.message) // Display error message
        return
      }

      localStorage.setItem('token', data.token)
      toast.success('Registered Successfully')

      resetForm()
      navigate('/home')
    } catch (error: any) {
      toast.error(error.message) // Handle other exceptions
    }
  }

  return (
    <Container maxWidth="sm" sx={{ height: '70vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '10vh',
          backgroundColor: '#f5f5f5',
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 25
          
        }}
      >
        <Typography variant="h3" gutterBottom align="center">
          Register
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
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
                marginTop: '20px'
              }}
            >
              <Field
                name="name"
                type="text"
                as={TextField}
                label="Name"
                variant="outlined"
                fullWidth
                required
                helperText={<ErrorMessage name="name" />}
                error={!!values.name && !!values.name.length === 0}
              />

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

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={registerUserResponse.isLoading}
                >
                  {registerUserResponse.isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary" component="span">
                      Login
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Container>
  )
}

export default Register
