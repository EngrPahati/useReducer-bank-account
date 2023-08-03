import "./styles.css";
import {useReducer} from 'react';

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example 
that I used as an analogy to explain how useReducer works, but it's 
simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, 
deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState`
 below to get started.

3. All operations (expect for opening account) can only be performed if 
isActive is true. If it's not, just return the original state object.
 You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also
 a minimum deposit amount of 500 to open an account (which means that 
  the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that 
condition is met, the requested amount will be registered in the 'loan' 
state, and it will be added to the balance. If the condition is not met, 
just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken 
from the balance, and the 'loan' will get back to 0. This can lead to negative 
balances, but that's no problem, because the customer can't close their account 
now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is 
zero. If this condition is not met, just return the state. If the condition is met, 
the account is deactivated and all money is withdrawn. The account basically gets back
 to the initial state
*/
const MIN_DEPOSIT = 500;
// const DEPOSIT_150 = 150;
// const WITHDRAW_50 = 50;

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  deposit: 150,
  withdraw: 50,
  hasLoan: false, 
  requestLoan: 5000,
};

function reducer(state, action) {
  switch (action.type) {
    case 'openAccount': 
      return {
        ...state,
        balance: MIN_DEPOSIT,
        isActive: true,
      }
    
    case 'deposit':
      return {
        ...state,
        balance: state.balance + state.deposit,
      }
    
    case 'changeDepositValue':
      return {
        ...state,
        deposit: action.payload,
      }
    
    case 'withdraw':
      return {
        ...state,
        balance: state.balance - state.withdraw,
      }
    
    case 'changeWithdrawValue':
      return {
        ...state,
        withdraw: action.payload,
      }
    
    case 'requestLoan': 
      return {
        ...state,
        balance: state.balance + state.requestLoan,
        loan: state.loan + state.requestLoan,
        hasLoan: true,
      }
    
    case 'changeRequestLoan':
      return {
        ...state,
        requestLoan: action.payload
      }
    
    case 'payLoan':
      return {
        ...state,
        loan: 0,
        balance: state.balance - state.loan,
        hasLoan: false,
      }
    
    case 'closeAccount': 
      return initialState
    
    default:
      throw new Error("Action unknown");
}
}

export default function App() {
  const [{ balance, loan, isActive, deposit, withdraw, hasLoan, requestLoan}, dispatch] = useReducer(reducer, initialState);
  const canCloseAccount = isActive && balance === 0 && loan === 0;

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: { balance }</p>
      <p>Loan: { loan }</p>

      <p>
        <button onClick={() => dispatch({type: 'openAccount'})} disabled={isActive}>
          Open account
        </button>
      </p>
      <p>
        <input
          disabled={!isActive}
          value={deposit}
          onChange={(e) => { 
            if (!isNaN(Number(e.target.value))) {
              dispatch({
                type: 'changeDepositValue',
                payload: Number(e.target.value)
              })
            }
          }
        } />
        <button
          onClick={() => dispatch({ type: 'deposit' })}
          disabled={!isActive}>
          Deposit { deposit }
        </button>
      </p>

      <p>
      <input
          disabled={!isActive}
          value={withdraw}
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              dispatch({
                type: 'changeWithdrawValue',
                payload: Number(e.target.value)
              })
            }}} />
        <button onClick={() => dispatch({type: 'withdraw'})} disabled={!isActive}>
          Withdraw 50
        </button>
      </p>


      <p>
        <input
          disabled={!isActive || hasLoan}
          value={requestLoan}
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              dispatch({
                type: 'changeRequestLoan',
                payload: Number(e.target.value) || 0
              })
            }
          }}/>
        <button onClick={() => dispatch({type: 'requestLoan'})} disabled={!isActive || hasLoan}>
          Request a loan of { requestLoan }
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({type: "payLoan"})} disabled={!isActive}>
          Pay loan
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({type: "closeAccount"})} disabled={!canCloseAccount}>
          Close account
        </button>
      </p>
    </div>
  );
}
