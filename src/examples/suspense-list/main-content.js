import React from 'react'
import {getImageUrlForPokemon} from '../../fetch-pokemon'
import * as cn from './main-content.module.css'

const transactions = [
  {
    id: 1,
    recipient: 'mew',
    amount: '₽ 5530.34',
    message: 'Thanks for the salad 🥗',
  },
  {
    id: 2,
    recipient: 'charizard',
    amount: '₽ 2000.00',
    message:
      'Thanks for the tip about Gyarados 🌊. I never would have won otherwise 😈',
  },
  {
    id: 3,
    recipient: 'ditto',
    amount: '₽ 12.21',
    message: 'blub.',
  },
  {
    id: 4,
    recipient: 'mewtwo',
    amount: '₽ 3500.00',
    message: `Still can't 🔥 Charizard 🔥 won. That's the last time I bet against him.`,
  },
  {
    id: 4,
    recipient: 'pikachu',
    amount: '₽ 9129.10',
    message: 'That was ELECTRIC ⚡',
  },
]

function MainContent() {
  return (
    <div className={cn.root}>
      <div className={cn.container}>
        <div className={cn.quickLook}>
          <div>
            <div className={cn.quickLookTitle}>Watch out for Go players!</div>
            <div>
              <img src="/img/pokemongo.jpg" alt="pokemon go" />
            </div>
          </div>
          <div>
            <div className={cn.quickLookTitle}>Collector's Squirtle Toy</div>
            <div>
              <img src="/img/squirtle-toy.jpg" alt="squirtle figurine" />
            </div>
          </div>
        </div>
        <div className={cn.createNewTransaction}>
          <form>
            <div>
              <label htmlFor="recipient">Recipient</label>
              <input id="recipient" placeholder="Username or Email" />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input id="amount" placeholder="$0.00" />
            </div>
            <div className={cn.newTransactionSubmitButton}>
              <button type="submit" disabled>
                Submit
              </button>
            </div>
          </form>
        </div>
        {transactions.map(t => (
          <Transaction key={t.id} {...t} />
        ))}
      </div>
    </div>
  )
}

function Transaction({recipient, amount, message}) {
  return (
    <div className={cn.transaction}>
      <div>
        <img
          className={cn.transactionImage}
          src={getImageUrlForPokemon(recipient)}
          alt={recipient}
        />
      </div>
      <div>
        <div className={cn.transactionAmount}>{amount}</div>
        <div className={cn.transactionMessage}>{message}</div>
      </div>
    </div>
  )
}

export default MainContent
