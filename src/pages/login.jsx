import { useState } from 'react';
//import { useNavigate } from "react-router-dom";
import { useAuth } from '../Context/authContext';

function Login() {
  const [userSignup, setUserSignup] = useState({ usuario: "", password: "" });
  const [userLogin, setUserLogin] = useState({
    usuario: '',
    name: '',
    secondName: '',
    email: '',
    password: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [active, setActive] = useState('login');

 // const navigate = useNavigate();
  const { login } = useAuth();

  const handlerChangeSignUp = ({ target: { name, value } }) => {
    setUserSignup({ ...userSignup, [name]: value });
  };

  const handlerChangeLogin = ({ target: { name, value } }) => {
    setUserLogin({ ...userLogin, [name]: value });
  };
  //validar inicio de sesion 
  const validateSignUp = (data) => {
    const newErrors = {};
    if (!data.usuario) newErrors.usuario = 'El usuario es obligatorio';
    if (!data.name) newErrors.name = 'El nombre es obligatorio';
    if (!data.secondName) newErrors.secondName = 'El apellido es obligatorio';
    if (!data.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'El correo no es válido';
    }
    if (!data.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (data.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    return newErrors;
  };
//funcion registro de usuario
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setErrors({});
    setError('');
    setMensaje('');

    const validationErrors = validateSignUp(userLogin);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await fetch('https://personaltaskphp.up.railway.app/api/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userLogin),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear usuario');
      }
      e.target.reset();  //<- vacia los inputs
      setShowPassword(false);
      setMensaje('¡Usuario creado con éxito!');
      setUserLogin({ usuario: '', name: '', secondName: '', email: '', password: '' });

      // Cambiar a vista de login después de un pequeño delay
      setTimeout(() => {
        setMensaje('');
        setActive('login');
      }, 1000);

    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
    }
  };
  //iniciar sesion
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(userSignup);

    }  catch (err) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
    }
  };

  return (
    <div className={`login-page ${active === 'signup' ? 'signup-mode' : ''}`}>
      <div className="Contenedor">
        <div className="forms-container">

          {/* Login Form */}
          <form className="form login-form" onSubmit={handleSubmitLogin}>
            <h2>Iniciar Sesión</h2>
            <div className="input-group">
              <input onChange={handlerChangeSignUp} placeholder='' name='usuario' type="text" required />
              <label>Usuario</label>
            </div>
            <div className="input-group">
              <input onChange={handlerChangeSignUp} placeholder='' name='password' type={showPassword ? "text" : "password"} required />
              <label>Contraseña</label>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-submit">Iniciar sesión</button>
          </form>

          {/* Registro Form */}
          <form className="form signup-form" onSubmit={handleSubmitSignUp}>
            <h2>Registrarse</h2>
            <div className="input-group">
              <input onChange={handlerChangeLogin} placeholder='' name='usuario' type="text" required />
              <label>Usuario</label>
              {errors.usuario && <p className="error-message">{errors.usuario}</p>}
            </div>
            <div className="input-group">
              <input onChange={handlerChangeLogin} placeholder='' name='name' type="text" required />
              <label>Nombre</label>
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="input-group">
              <input onChange={handlerChangeLogin} placeholder='' name='secondName' type="text" required />
              <label>Apellido</label>
              {errors.secondName && <p className="error-message">{errors.secondName}</p>}
            </div>
            <div className="input-group">
              <input onChange={handlerChangeLogin} placeholder='' name='email' type="email" required />
              <label>Correo</label>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-group">
              <input onChange={handlerChangeLogin} placeholder='' name='password' type={showPassword ? "text" : "password"} required />
              <label>Contraseña</label>
              {errors.password && <p className="error-message">{errors.password}</p>}
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {mensaje && <p className="success-message">{mensaje}</p>}
            <button className="btn-submit" type="submit">Crear cuenta</button>
          </form>
        </div>

        <div className="toggle-container">
          {active === 'login' ? (
            <div className="text">
              <p>¿No tienes cuenta?</p>
              <button onClick={() => setActive('signup')} className="btn switch">Registrarse</button>
            </div>
          ) : (
            <div className="text">
              <p>¿Ya tienes cuenta?</p>
              <button onClick={() => setActive('login')} className="btn switch">Iniciar sesión</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
