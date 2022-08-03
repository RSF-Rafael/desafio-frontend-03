import './style.css';
import close from '../../assets/close-icon-modal.png';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { setItem, getItem } from '../../utils/storage';


function ModalProfile({ showProfileModal, setShowProfileModal, user, setUser }) {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [checkPassword, setCheckPassword] = useState(false);
    const [showEditMessage, setShowEditMessage] = useState(false);

    useEffect(() => {
        setForm({
            ...form,
            name: getItem('userName'),
            email: user.email
        })

    }, [showProfileModal])

    function handleCloseModal() {
        setItem('userName', form.name)
        setForm({
            ...form,
            password: '',
            confirmPassword: ''
        })
        setShowProfileModal(false);
    }

    function handleChangeInput(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
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
            const token = getItem('token');
            const response = await api.put(`/usuario`,
                {
                    nome: form.name,
                    email: form.email,
                    senha: form.password,
                },
                {
                    headers: {
                        token: `${token}`
                    }
                }
            );

            setShowEditMessage(true);
            setTimeout(() => {
                setShowEditMessage(false);
                handleCloseModal();
            }, 2000);

        } catch (err) {
            setError(err.response.data.mensagem);
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    };

    return (
        <>
            {showProfileModal &&
                <div className="container-modal">
                    <div className='modal__card'>
                        <div className='modal__card--title'>
                            <h1>Editar Perfil</h1>
                            <img
                                className='close-modal'
                                src={close}
                                alt='Fechar'
                                onClick={handleCloseModal}
                            />
                        </div>
                        <form className='modal__form' onSubmit={handleSubmit}>
                            <label htmlFor='name'>Nome</label>
                            <input
                                type='text'
                                name='name'
                                value={form.name}
                                onChange={handleChangeInput}
                                required
                            />
                            <label htmlFor='email'>Email</label>
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
                            {showEditMessage && <span>Usuário atualizado com sucesso.</span>}
                            <button className='modal__form--button' type='submit'>Confirmar</button>
                        </form>
                    </div>
                </div >
            }
        </>
    );
}

export default ModalProfile;
