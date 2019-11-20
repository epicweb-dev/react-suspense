import React from 'react'
import {getImageUrlForPokemon} from '../../fetch-pokemon'
import * as cn from './main-content.module.css'

const transactions = [
  {
    id: '4P812765GHI029827',
    recipient: 'mew',
    amount: '₽ 5530.34',
    message: 'Thanks for the salad 🥗',
  },
  {
    id: '90X21040KL118401T',
    recipient: 'charizard',
    amount: '₽ 2000.00',
    message:
      'Thanks for the tip about Gyarados 🌊. I never would have won otherwise 😈',
  },
  {
    id: '0A6FJI65K8173802P',
    recipient: 'ditto',
    amount: '₽ 12.21',
    message: 'blub.',
  },
  {
    id: '9CF911038X034441W',
    recipient: 'mewtwo',
    amount: '₽ 3500.00',
    message: `Still can't 🔥 Charizard 🔥 won. That's the last time I bet against him.`,
  },
  {
    id: '48L3561JH8132451D',
    recipient: 'pikachu',
    amount: '₽ 9129.10',
    message: 'That was ELECTRIC ⚡',
  },
  {
    id: '6CG59877V61376422',
    recipient: 'ditto',
    amount: '₽ 98.89',
    message: 'blub.',
  },
  {
    id: '8XS08JI93J918102S',
    recipient: 'charizard',
    amount: '₽ 4503.14',
    message: 'Lunch was delicious, thank you!',
  },
  {
    id: '21CWW205ND917964J',
    recipient: 'mew',
    amount: '₽ 1262.87',
    message: 'Thanks again for the ride 🍃',
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
              <button type="submit">Submit</button>
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

function Transaction({id, recipient, amount, message}) {
  return (
    <div className={cn.transaction}>
      <div className={cn.transactionId}>{id}</div>
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
