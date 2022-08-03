import './style.css';
import logo from '../../assets/logo.png';
import profile from '../../assets/profile.png';
import arrow from '../../assets/arrow.png';
import filter from '../../assets/filter-icon.png';
import editIcon from '../../assets/edit-icon.png';
import deleteIcon from '../../assets/delete-icon.png';
import addFilter from '../../assets/add-filter.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeItem, getItem } from '../../utils/storage';
import { format, getDay } from 'date-fns';
import ModalTransactions from '../../components/ModalTransactions';
import ModalProfile from '../../components/ModalProfile';
import ConfirmDelete from '../../components/ConfirmDelete';
import api from '../../services/api';

function Home() {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState();
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState({});
  const [user, setUser] = useState({})
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  useEffect(() => {
    listCategories();
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [showProfileModal])

  useEffect(() => {
    reloadPageInfo();
  }, [showModal, showDeleteConfirmation]);

  const reloadPageInfo = async () => {
    try {
      const token = getItem('token');
      const response = await api.get(`/transacao`,
        {
          headers: {
            token: `${token}`
          }
        }
      );
      const localTransactions = [...response.data];
      setTransactions([...localTransactions]);

    } catch (err) {
      setError(err.response.data.mensagem)
      setTimeout(() => {
        setError('');
      }, 3000);
    }

    try {
      const token = getItem('token');
      const response = await api.get(`/transacao/extrato`,
        {
          headers: {
            token: `${token}`
          }
        }
      );
      setOverview({ ...response.data, saldo: response.data.entrada - response.data.saida })
    } catch (err) {
      setError(err.response.data.mensagem)
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const loadUserInfo = async () => {
    try {
      const token = getItem('token');
      const response = await api.get(`/usuario`,
        {
          headers: {
            token: `${token}`
          }
        }
      );
      setUser({ ...response.data });

    } catch (err) {
      setError(err.response.data.mensagem)
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const listCategories = async () => {
    try {
      const token = getItem('token');
      const response = await api.get(`/categoria`,
        {
          headers: {
            token: `${token}`
          }
        }
      );
      const localCategories = [...response.data];
      setCategories([...localCategories]);

    } catch (err) {
      setError(err.response.data.mensagem)
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  function handleAddTransaction() {
    setCurrentTransaction({});
    setShowModal(true);
  };

  function handleEditProfile() {
    setShowProfileModal(true);
  };

  function handleLogout() {
    removeItem('token');
    removeItem('userId');
    navigate('/login');
  };

  function handleEditTransaction(transaction) {
    setShowModal(true);
    setCurrentTransaction(transaction);
    setIsEdit(true);
  };

  function handleDeleteTransaction(transaction) {
    setTransactionId(transaction.id);
    setShowDeleteConfirmation(true);
  };

  const verifyFilters = (category) => {
    const localFilter = [...selectedFilter];
    if (localFilter.includes(category)) {
      return true;
    } else {
      return false;
    }

  };

  function handleAddFilter(category) {
    const localFilter = [...selectedFilter];

    if (localFilter.includes(category)) {
      const index = localFilter.indexOf(category);
      localFilter.splice(index, 1);
      setSelectedFilter(localFilter);
      return;
    }

    localFilter.push(category);
    setSelectedFilter(localFilter);
  }

  async function handleClearFilter() {
    setSelectedFilter([]);
    reloadPageInfo();
  };

  async function handleFilter() {
    const localFilter = [...selectedFilter];
    try {
      const token = getItem('token');
      let query = `?`;

      for (let i = 0; i < localFilter.length; i++) {
        query = query + `filtro[]=${localFilter[i].descricao}`
        if (i < localFilter.length - 1)
          query = query + `&`;
      }
      const response = await api.get(`/transacao${query}`,
        {
          headers: {
            token: `${token}`
          }
        }
      );

      setTransactions(response.data)

    } catch (err) {
      setError(err.response.data.mensagem);
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  }

  return (
    <div className="container-home">
      <header>
        <img className='logo' src={logo} alt='Logo'></img>
        <div className='profile'>
          <img
            className='profile__img'
            src={profile}
            alt='Imagem de perfil'
            onClick={handleEditProfile}
          />
          <span className='profile__span'>{getItem('userName')}</span>
          <img
            className='profile__img--arrow'
            src={arrow}
            alt='Sair'
            onClick={handleLogout}
          />
        </div>
      </header>
      <main>
        <div className='filter' onClick={() => setIsFilter(!isFilter)}>
          <img className='filter__img' src={filter} alt='Filtro'></img>
          <span className='filter__span'>Filtrar</span>
        </div>
        <div className='container-asides'>
          <aside className='aside-left'>
            {isFilter &&
              <div className='container-filter'>
                <div className='categories__card'>
                  <h1>Categoria</h1>
                  <div className='container-filter__categories'>
                    {categories.map((category) => (
                      <div
                        className={verifyFilters(category) ? 'container-filter__category background-purple' : 'container-filter__category'}
                        key={category.id}
                        onClick={() => handleAddFilter(category)}
                      >
                        <span>{category.descricao}</span>
                        <img src={addFilter} alt='Adicionar filtro' />
                      </div>
                    ))}
                  </div>
                  <div className='container-filter__buttons'>
                    <button
                      className='clear-filter'
                      onClick={() => handleClearFilter()}
                    >
                      Limpar Filtros
                    </button>
                    <button
                      className='background-purple'
                      onClick={() => handleFilter()}
                    >
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              </div>
            }
            <div className='transactions-info'>
              <div className='transactions-info__header'>
                <div className='transactions-info__date'>
                  <span>Data</span>
                  <img />
                </div>
                <div className='transactions-info__day'>
                  <span>Dia da semana</span>
                  <img></img>
                </div>
                <div className='transactions-info__description'>
                  <span>Descrição</span>
                  <img />
                </div>
                <div className='transactions-info__category'>
                  <span>Categoria</span>
                  <img />
                </div>
                <div className='transactions-info__value'>
                  <span>Valor</span>
                  <img />
                </div>
                <div></div>
              </div>
              {transactions.map((transaction) => (
                <div className='transactions-info__details' key={transaction.id}>
                  <div className='transactions-info__date'>
                    <span>
                      {format(new Date(transaction.data), 'dd/MM/yyyy')}
                    </span></div>
                  <div className='transactions-info__day'>
                    <span>
                      {diasDaSemana[getDay(new Date(transaction.data))]}
                    </span>
                  </div>
                  <div className='transactions-info__description'>
                    <span>{transaction.descricao}</span>
                  </div>
                  <div className='transactions-info__category'>
                    <span>{transaction.categoria_nome}</span>
                  </div>
                  <div className={transaction.tipo === 'entrada' ? 'transactions-info__value purple' : 'transactions-info__value orange'}>
                    <span>
                      {Number(transaction.valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className='transactions-info__icons'>
                    <img
                      className='edit-transaction'
                      src={editIcon}
                      alt='Editar'
                      onClick={() => handleEditTransaction(transaction)}
                    />
                    <img
                      className='delete-transaction'
                      src={deleteIcon}
                      alt='Deletar'
                      onClick={() => handleDeleteTransaction(transaction)}
                    />
                  </div>
                  {transaction.id === transactionId &&
                    < ConfirmDelete
                      showDeleteConfirmation={showDeleteConfirmation}
                      setShowDeleteConfirmation={setShowDeleteConfirmation}
                      transaction={transaction}
                    />}
                </div>
              ))}
            </div>
          </aside>
          <aside className='aside-right'>
            <div className='overview'>
              <h1>Resumo</h1>
              <div className='incoming'>
                <span>Entradas</span>
                <span className='purple'>{Number(overview.entrada / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className='outgoing'>
                <span>Saídas</span>
                <span className='orange'>{Number(overview.saida / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className='overview-line'></div>
              <div className='balance'>
                <span>Saldo</span>
                <span className='blue'>{Number(overview.saldo / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>
            <button
              onClick={() => handleAddTransaction()}
            >Adicionar registro</button>
          </aside>
        </div>
        <ModalTransactions
          showModal={showModal}
          setShowModal={setShowModal}
          categories={categories}
          currentTransaction={currentTransaction}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
        <ModalProfile
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
          user={user}
          setUser={setUser}
          loadUserInfo={loadUserInfo}
        />
      </main >

    </div >
  );
}

export default Home;
