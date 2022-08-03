import './style.css';
import close from '../../assets/close-icon-modal.png';
import { useEffect, useState } from 'react';
import { clear, getItem } from '../../utils/storage';
import api from '../../services/api';
import { format } from 'date-fns';

function ModalTransactions({ showModal, setShowModal, categories, currentTransaction, isEdit, setIsEdit }) {

    const [form, setForm] = useState({
        value: '',
        category: '',
        date: '',
        description: ''
    });

    const [error, setError] = useState('');
    const [isIncoming, setIsIncoming] = useState(false);
    const [isOutgoing, setIsOutgoing] = useState(true);
    const [category, setCategory] = useState({});
    const [transactionOk, setTransactionOk] = useState(false);
    const [editOk, setEditOk] = useState(false);

    useEffect(() => {
        if (currentTransaction.data) {
            const date = String(currentTransaction.data);
            const year = date.slice(0, 4);
            const month = date.slice(5, 7);
            const day = date.slice(8, 10);

            setForm({
                value: (Number(currentTransaction.valor) / 100).toFixed(2).toString().replace('.', ','),
                date: format(new Date(year, month - 1, day), 'dd/MM/yyyy'),
                description: currentTransaction.descricao,
                category: currentTransaction.categoria_id
            });

            if (currentTransaction.tipo === 'entrada') {
                setIsIncoming(true);
                setIsOutgoing(false);
            }
        }

    }, [showModal])

    function clearForm() {
        setForm({
            value: '',
            category: '',
            date: '',
            description: ''
        })
    };

    function handleChangeInput(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    function handleSelect(e) {
        setCategory(e.target.value);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.description || !form.value || !form.date || !category)
            return;

        const value = Number(form.value.replace(',', '.')) * 100;
        const day = form.date.slice(0, 2);
        const month = form.date.slice(3, 5);
        const year = form.date.slice(6)

        const date = format(new Date(year, month - 1, day), 'dd/MM/yyyy');
        if (isEdit) {
            try {
                const token = getItem('token');
                const response = await api.put(`/transacao/${currentTransaction.id}`,
                    {
                        descricao: form.description,
                        valor: value,
                        data: date,
                        categoria_id: category,
                        tipo: isIncoming ? 'entrada' : 'saida'
                    },
                    {
                        headers: {
                            token: `${token}`
                        }
                    }
                );

                setEditOk(true);
                setTimeout(() => {
                    setEditOk(false);
                    handleCloseModal();
                }, 2000);

            } catch (err) {
                setError(err.response.data.mensagem);
                setTimeout(() => {
                    setError('');
                }, 2000);
            }
        } else {
            try {
                const token = getItem('token');
                const response = await api.post(`/transacao`,
                    {
                        descricao: form.description,
                        valor: value,
                        data: date,
                        categoria_id: category,
                        tipo: isIncoming ? 'entrada' : 'saida'
                    },
                    {
                        headers: {
                            token: `${token}`
                        }
                    }
                );

                clearForm();
                setTransactionOk(true);
                setTimeout(() => {
                    setTransactionOk(false);
                }, 2000);

            } catch (err) {
                setError(err.response.data.mensagem);
                setTimeout(() => {
                    setError('');
                }, 2000);
            }
        }
    };

    function handleTransactionType(e) {
        if (e.target.innerHTML === 'Entrada') {
            setIsIncoming(true);
            setIsOutgoing(false);
        }

        if (e.target.innerHTML === 'Saída') {
            setIsIncoming(false);
            setIsOutgoing(true);
        }
    }

    function handleCloseModal() {
        clearForm();
        setShowModal(false);
        setIsEdit(false);
        setIsIncoming(false);
        setIsOutgoing(true);
    }

    return (
        <>
            {showModal &&
                <div className="container-modal">
                    <div className='modal__card'>
                        <div className='modal__card--title'>
                            <h1>{isEdit ? 'Editar Registro' : 'Adicionar Registro'}</h1>
                            <img
                                className='close-modal'
                                src={close}
                                alt='Fechar'
                                onClick={handleCloseModal}
                            />
                        </div>
                        <div className='transaction-type'>
                            <button
                                className={isIncoming ? 'blue left' : 'gray left'}
                                onClick={(e) => handleTransactionType(e)}
                            >
                                Entrada
                            </button>
                            <button
                                className={isOutgoing ? 'red right' : 'gray right'}
                                onClick={(e) => handleTransactionType(e)}
                            >
                                Saída
                            </button>
                        </div>
                        <form className='modal__form' onSubmit={handleSubmit}>
                            <label htmlFor='value'>Valor</label>
                            <input
                                type='text'
                                name='value'
                                value={form.value}
                                placeholder={isEdit ? Number(currentTransaction.valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : undefined}
                                onChange={handleChangeInput}
                                required
                            />
                            <label htmlFor='category'>Categoria</label>
                            <select
                                name='categories'
                                onChange={(e) => handleSelect(e)}
                            >
                                <option>Selecione uma opção</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.descricao}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor='date'>Data</label>
                            <input
                                type='text'
                                name='date'
                                value={form.date}
                                placeholder={isEdit ? format(new Date(currentTransaction.data), 'dd/MM/yyyy') : undefined}
                                onChange={handleChangeInput}
                                required
                            />
                            <label htmlFor='description'>Descrição</label>
                            <input
                                type='text'
                                name='description'
                                value={form.description}
                                placeholder={isEdit ? currentTransaction.descricao : undefined}
                                onChange={handleChangeInput}
                                required
                            />
                            {transactionOk && <span>Transação adicionada com sucesso.</span>}
                            {editOk && <span>Transação editada com sucesso.</span>}
                            {error && <span>{error}</span>}
                            <button className='modal__form--button' type='submit'>Confirmar</button>
                        </form>
                    </div>
                </div >
            }
        </>
    );
}

export default ModalTransactions;
