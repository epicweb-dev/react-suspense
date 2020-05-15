// Coordinate Suspending components with SuspenseList
// http://localhost:3000/isolated/final/07.js

import React from 'react'
import {ErrorBoundary, Img} from '../utils'
import {createChat} from '../chats'

// const allChats = Array.from({length: 4}, () => createChat())
const allChats = [
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'text'}),
  createChat({type: 'video'}),
  createChat({type: 'video'}),
  createChat({type: 'video'}),
  createChat({type: 'video'}),
]

function Text({message}) {
  return <div>{message}</div>
}

function Video({message, link, resource}) {
  const [load, setLoad] = React.useState(false)
  return (
    <div>
      <div>{message}</div>
      <div>
        <a href={link}>{resource.title}</a>
        {load ? (
          <video controls style={{maxWidth: '100%'}}>
            <source src={resource.url} type="video/mp4" />
          </video>
        ) : (
          <button onClick={() => setLoad(true)}>Click to show</button>
        )}
      </div>
    </div>
  )
}

function Audio({message, link, resource}) {
  const [load, setLoad] = React.useState(false)
  return (
    <div>
      <div>{message}</div>
      <div>
        <a href={link}>{resource.title}</a>
        {load ? (
          <audio controls style={{maxWidth: '100%'}}>
            <source src={resource.url} type="video/mp4" />
          </audio>
        ) : (
          <button onClick={() => setLoad(true)}>Click to show</button>
        )}
      </div>
    </div>
  )
}

function Image({message, link, resource}) {
  return (
    <div>
      <div>{message}</div>
      <div>
        <a href={link}>
          <Img
            src={resource.url}
            alt={resource.title}
            style={{maxWidth: '100%'}}
          />
        </a>
      </div>
    </div>
  )
}

function Link({message, link, resource}) {
  return (
    <div>
      <div>{message}</div>
      <div>
        <a href={link}>
          <Img
            src={resource.url}
            alt={resource.title}
            style={{maxWidth: '100%'}}
          />
        </a>
      </div>
    </div>
  )
}

function Event({message, link, resource}) {
  return (
    <div>
      <div>{message}</div>
      <div>
        <strong>Cool event:</strong>
        <a href={link}>{resource.title}</a>
        <Img
          src={resource.url}
          alt={resource.title}
          style={{maxWidth: '100%'}}
        />
      </div>
    </div>
  )
}

const types = {
  text: Text,
  video: Video,
  audio: Audio,
  image: Image,
  link: Link,
  event: Event,
}

function useStickyScrollContainer(scrollContainerRef) {
  const [isStuck, setStuck] = React.useState(true)
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    function handleScroll() {
      const {clientHeight, scrollTop, scrollHeight} = scrollContainer
      const partialPixelBuffer = 10
      const scrolledUp =
        clientHeight + scrollTop < scrollHeight - partialPixelBuffer
      setStuck(!scrolledUp)
    }
    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  const isStuckRef = React.useRef(isStuck)
  React.useLayoutEffect(() => {
    isStuckRef.current = isStuck
  }, [isStuck])

  // scroll to bottom right away
  React.useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current
    scrollContainer.scrollTop = scrollContainer.scrollHeight
  }, [scrollContainerRef])

  React.useEffect(() => {
    const observer = new MutationObserver(entries => {
      const scrollContainer = scrollContainerRef.current
      if (isStuckRef.current) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    })
    observer.observe(scrollContainerRef.current, {
      childList: true,
      subtree: false,
      attributes: false,
    })
    return () => observer.disconnect()
  }, [scrollContainerRef])

  return isStuck
}

function App() {
  const containerRef = React.useRef()
  useStickyScrollContainer(containerRef)
  const [chats, setChats] = React.useState(allChats.slice(0, 4))

  function addMessage() {
    setChats(c => {
      const nextChat = allChats[c.length]
      if (nextChat) return [...c, nextChat]
      else return c
    })
  }

  return (
    <div>
      <button onClick={addMessage}>Add message</button>
      <ol
        ref={containerRef}
        style={{
          listStyle: 'none',
          paddingLeft: 0,
          width: 300,
          height: 300,
          overflowY: 'scroll',
        }}
      >
        {chats.map(chat => (
          <ErrorBoundary key={chat.id}>
            <React.Suspense fallback={<li>Loading {chat.type}</li>}>
              <li>{React.createElement(types[chat.type], chat)}</li>
              <hr />
            </React.Suspense>
          </ErrorBoundary>
        ))}
      </ol>
      <label>Continue the conversation:</label>
      <input type="text" />
    </div>
  )
}

export default App
