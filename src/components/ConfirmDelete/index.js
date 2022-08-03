import './style.css';
import arrow from '../../assets/arrow-delete.png';
import { useState } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/storage';


function ConfirmDelete({ showDeleteConfirmation, setShowDeleteConfirmation, transaction }) {

    const [error, setError] = useState('');

    function handleDeny() {
        setShowDeleteConfirmation(false);
    }

    async function handleConfirm() {
        try {
            const token = getItem('token');
            const response = await api.delete(`/transacao/${transaction.id}`,
                {
                    headers: {
                        token: `${token}`
                    }
                }
            );

            console.log(response.data);

        } catch (err) {
            setError(err.response.data.mensagem);
            setTimeout(() => {
                setError('');
            }, 2000);
        }

        setShowDeleteConfirmation(false);
    }

    return (
        <>
            {showDeleteConfirmation &&
                <div className="container-delete">
                    <img src={arrow} alt='' />
                    <div className='container-delete__card'>
                        <h1>Apagar item?</h1>
                        <div className='confirmation'>
                            <button
                                className='confirm'
                                onClick={() => handleConfirm()}
                            >
                                Sim
                            </button>
                            <button
                                className='deny'
                                onClick={() => handleDeny()}
                            >
                                Não
                            </button>
                        </div>
                        {error && <span>{error}</span>}
                    </div>
                </div>
            }
        </>
    );
}

export default ConfirmDelete;
