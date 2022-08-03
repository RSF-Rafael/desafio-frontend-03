import './style.css';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Register() {

  const navigate = useNavigate();
  const [checkPassword, setCheckPassword] = useState(false)
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });


  function handleChangeInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCheckPassword(false);

    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return;

    if (form.password !== form.confirmPassword) {
      setCheckPassword(true);
      setTimeout(() => {
        setCheckPassword(false);
      }, 3000)
      return;
    }

    try {
      const response = await api.post(`/usuario`,
        {
          nome: form.name,
          email: form.email,
          senha: form.password
        },
      );
      console.log(response);

      navigate('../login');
    } catch (err) {
      setError(err.response.data.mensagem)
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="container-register">
      <img className='logo' src={logo} alt='Logo'></img>
      <div className='register'>
        <h1 className=''>Cadastre-se</h1>
        <form className='register__form' onSubmit={handleSubmit}>
          <label htmlFor='name'>Nome</label>
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleChangeInput}
            required
          />
          <label htmlFor='email'>E-mail</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChangeInput}
            required
          />
          <label htmlFor='password'>Senha</label>
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChangeInput}
            required
          />
          <label htmlFor='confirmPassword'>Confirmação de senha</label>
          <input
            type='password'
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={handleChangeInput}
            required
          />
          {checkPassword && <span>Digite a mesma senha em ambos os campos.</span>}
          {error && <span>{error}</span>}
          <button className='register__form--button' type='submit'>Cadastrar</button>
        </form>

        <a onClick={() => navigate('/login')}>Já tem cadastro? Clique aqui!</a>
      </div>
    </div>
  );
}

export default Register;
