import React, { useState, useEffect, useRef } from 'react'
import { getSpecificStories, cleanSavedData } from '../../utilities';
import Error from '../ErrorDisplay';
import PlaceHolder from '../PlaceHolder';
import { Article } from '../../components'
import '../pages.css'
import { SavedContainer, InfoWrap } from './Saved.elements'

const Saved = (props) => {
  const [savedStories, setSavedStories] = useState([]);
  const [error, setError] = useState(null);
  const getSavedStories = useRef(() => {});

  useEffect(() => {
    if (props.saved.length) {
      getSavedStories.current()
       .then(data => setSavedStories(cleanSavedData(data)))
       .catch(error => setError(error.message))
    }
  }, []);

  const updateSaved = (id) => {
    if (!props.saved.includes(id)) {
      props.setSavedStories([...props.saved, id])
    } else {
      props.setSavedStories(props.saved.filter(story => story !== id))
    }
  }

  const updateRead = (id) => {
    if (!props.read.includes(id)) {
      props.setReadStories([...props.read, id])
    } else {
      props.setReadStories(props.read.filter(story => story !== id))
    }  }  

  const updateOpened = (id) => {
    if (!props.opened.includes(id)) {
      props.setOpenedStories([...props.opened, id])
    } else {
      props.setOpenedStories(props.opened.filter(story => story !== id))
    }  
  }

  const getStoryState = (id) => {
    let status = []
    if (props.save === undefined) {
      return
    }
    if (props.saved.includes(id)) {
      status.push('saved');
    }
    if (props.read.includes(id)) {
      status.push('read');
    }
    if (props.opened.includes(id)) {
      status.push('opened');
    }
    return status;
  }
  
  getSavedStories.current = async () => {
    let requestURL = 'http://hn.algolia.com/api/v1/search_by_date?query='
    let attributes = '&numericFilters=created_at_i='
    return await Promise.all(
      props.saved.map(story => getSpecificStories(requestURL + story.tag + attributes + story.id))
    )
  };

  return (
    <SavedContainer>
      {!props.saved.length && !error && <h1>No saved stories!</h1>}
      {!!props.saved.length && !savedStories.length && !error && <PlaceHolder/>}
      {!props.saved.length && !savedStories.length && error && <Error error={error}/>}
      {!!props.saved.length && !error && savedStories.length &&
        <InfoWrap>
          {savedStories.map((story, i) => 
            <Article
              info={story}
              key={i}
              id={story.created_at_i}
              status={getStoryState(story.created_at_i)}
              saveStory={updateSaved}
              readStory={updateRead}
              openStory={updateOpened}
            />
          )}
        </InfoWrap>
      }
    </SavedContainer>
  )
}

export default Saved
