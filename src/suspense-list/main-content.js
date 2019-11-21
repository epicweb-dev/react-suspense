import React from 'react'
import Img from './img'
import * as cn from './main-content.module.css'

function MainContent({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div className={cn.root}>
      <div className={cn.container}>
        <div className={cn.quickLook}>
          <div>
            <div className={cn.quickLookTitle}>Watch out for Go players!</div>
            <div>
              <Img src="/img/pokemongo.jpg" alt="pokemon go" />
            </div>
          </div>
          <div>
            <div className={cn.quickLookTitle}>Collector's Squirtle Toy</div>
            <div>
              <Img src="/img/squirtle-toy.jpg" alt="squirtle figurine" />
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
        {pokemon.transactions.map(t => (
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
        <Img
          className={cn.transactionImage}
          src={`/img/pokemon/${recipient}.jpg`}
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
