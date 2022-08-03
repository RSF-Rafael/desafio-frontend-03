import './style.css';
import logo from '../../assets/logo.png';
import api from '../../services/api';
import { setItem, getItem } from '../../utils/storage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = getItem('token');
        if (token)
            navigate('/home');
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            if (!email || !password) {
                return;
            }

            const response = await api.post('/login', {
                email,
                senha: password
            });

            setItem('userName', response.data.usuario.nome)
            setItem('token', response.data.token);
            setItem('userId', response.data.usuario.id);

            navigate('/home');

        } catch (err) {
            setError(err.response.data.mensagem)
        }
    }

    return (
        <div className="container-login">
            <img className='logo' src={logo} alt='Logo'></img>
            <div className='app-info'>
                <h1>Controle suas <strong>finanças</strong>,
                    sem planilha chata.</h1>
                <p>
                    Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem tudo num único lugar e em um clique de distância.
                </p>
                <button onClick={() => navigate('/sign-up')}>Cadastre-se</button>
            </div>

            <div className='card-login'>
                <h1 className=''>Login</h1>
                <form className='login__form' onSubmit={handleSubmit}>
                    <label htmlFor='email'>E-mail</label>
                    <input
                        type='email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor='password'>Senha</label>
                    <input
                        type='password'
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <span>{error}</span>}
                    <button className='register__form--button' type='submit'>Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;