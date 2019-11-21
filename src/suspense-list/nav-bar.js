import React from 'react'
import Img from './img'
import * as cn from './nav-bar.module.css'
import {
  IoIosHome,
  IoIosNotifications,
  IoIosFiling,
  IoIosList,
  IoIosSync,
  IoIosCopy,
  IoIosCog,
} from 'react-icons/io'

function NavBar({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div className={cn.root}>
      <div className={cn.logoAndSearch}>
        <label htmlFor="search">
          <Img src="/img/pokeball.png" alt="pokebank" />
        </label>
        <input id="search" type="search" placeholder="Search Pokébank" />
      </div>
      <div className={cn.centerButtons}>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked the Home button')}
        >
          <IoIosHome />
        </button>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked the Notifications button')}
        >
          <IoIosNotifications />
        </button>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked the Filing button')}
        >
          <IoIosFiling />
        </button>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked your profile image')}
        >
          <Img
            className={cn.profilePhoto}
            src={`/img/pokemon/${pokemon.name.toLowerCase()}.jpg`}
            alt="user profile"
          />
        </button>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked the List button')}
        >
          <IoIosList />
        </button>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked the Sync button')}
        >
          <IoIosSync />
        </button>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked the Copy button')}
        >
          <IoIosCopy />
        </button>
      </div>
      <div>
        <button
          style={{color: pokemon.color}}
          onClick={() => alert('You clicked the Cog button')}
        >
          <IoIosCog />
        </button>
      </div>
    </div>
  )
}

export default NavBar
