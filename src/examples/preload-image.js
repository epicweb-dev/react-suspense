import React from 'react'
import {getImageUrlForPokemon} from '../fetch-pokemon'

// http://localhost:3000/isolated/examples/preload-image

const bulbasaurImageUrl = getImageUrlForPokemon('bulbasaur')
const dittoImageUrl = getImageUrlForPokemon('ditto')

const preloadImage = url => (document.createElement('img').src = url)
const preloadBulbasaur = () => preloadImage(bulbasaurImageUrl)
const preloadDitto = () => preloadImage(dittoImageUrl)

function PreloadImageExample() {
  const [showImages, setShowImages] = React.useState(false)

  return (
    <div>
      <button onClick={() => setShowImages(true)}>Show Images</button>
      <div style={{display: 'flex'}}>
        <div style={{border: '1px solid'}}>
          <div>
            <button onClick={preloadBulbasaur}>Preload Bulbasaur</button>
            <div>
              {showImages ? (
                <img src={bulbasaurImageUrl} alt="Bulbasaur" />
              ) : null}
            </div>
          </div>
        </div>
        <div style={{border: '1px solid'}}>
          <button onClick={preloadDitto}>Preload Ditto</button>
          <div>
            {showImages ? <img src={dittoImageUrl} alt="Ditto" /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreloadImageExample
