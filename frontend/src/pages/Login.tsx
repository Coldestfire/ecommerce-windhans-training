import { ErrorMessage, Field, Formik } from 'formik'
import { Button, TextField, Typography, Box, Container } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useLoginUserMutation } from '../provider/queries/Auth.query.ts'
import { toast } from 'sonner'

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
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
                marginTop: '20px'
              }}
            >
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
                  disabled={LoginUserResponse.isLoading}
                >
                  {LoginUserResponse.isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary" component="span">
                      Register
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

export default Login
