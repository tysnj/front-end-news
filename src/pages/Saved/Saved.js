import React, { useState, useEffect, useRef } from 'react'
import { getSpecificStories, cleanFilteredData } from '../../utilities';
import Error from '../ErrorDisplay';
import PlaceHolder from '../PlaceHolder';
import { Article } from '../../components'
import '../pages.css'
import { SavedContainer, InfoWrap } from './Saved.elements'
import PropTypes from 'prop-types';

const Saved = (props) => {
  const [savedPageStories, setSavedPageStories] = useState([]);
  const [error, setError] = useState(null);
  const getSavedStories = useRef(() => {});

  useEffect(() => {
    if (props.saved.length) {
      getSavedStories.current()
       .then(data => setSavedPageStories(cleanFilteredData(data)))
       .catch(error => setError(`Something's gone wrong. Please try again`))
    }
  }, []);

  getSavedStories.current = async () => {
    let requestURL = 'https://hn.algolia.com/api/v1/search_by_date?query='
    let attributes = '&numericFilters=created_at_i='
    return await Promise.all(
      props.saved.map(story => getSpecificStories(requestURL + story.tag + attributes + story.id))
    )
  };

  const updateSaved = (id, tag, status) => {
    if (props.saved.findIndex(story => story.id === id) === -1) {
      props.setSavedStories([...props.saved, {id: id, tag: tag}])
    } else if (props.saved.findIndex(story => story.id === id) !== -1 && !status) {
      props.setSavedStories([...props.saved])
    } else {
      props.setSavedStories(props.saved.filter(story => story.id !== id))
    }
  }

  const updateRead = (id, tag, status) => {
    if (props.read.findIndex(story => story.id === id) === -1) {
      props.setReadStories([...props.read, {id: id, tag: tag}])
    } else if (props.read.findIndex(story => story.id === id) !== -1 && !status) {
      props.setReadStories([...props.read])
    } else {
      props.setReadStories(props.read.filter(story => story.id !== id))
    }
  } 

  const updateOpened = (id, tag, status) => {
    if (props.opened.findIndex(story => story.id === id) === -1) {
      props.setOpenedStories([...props.opened, {id: id, tag: tag}])
    } else if (props.opened.findIndex(story => story.id === id) !== -1 && !status) {
      props.setOpenedStories([...props.opened])
    } else {
      props.setOpenedStories(props.opened.filter(story => story.id !== id))
    }
  }

  const getStoryState = (id) => {
    let status = []
    if (props.saved === undefined) {
      return
    }
    if (props.saved.findIndex(story => story.id === id) !== -1) {
      status.push('saved');
    }
     if (props.read.findIndex(story => story.id === id) !== -1) {
       status.push('read');
     }
     if (props.opened.findIndex(story => story.id === id) !== -1) {
       status.push('opened');
     }
    return status;
  }
  
  return (
    <SavedContainer>
      {!props.saved.length && !error && <h1>No saved stories!</h1>}
      {!!props.saved.length && !savedPageStories.length && !error && <PlaceHolder/>}
      {!props.saved.length && !savedPageStories.length && error && <Error error={error}/>}
      {!!props.saved.length && !error && savedPageStories.length &&
        <InfoWrap>
          {savedPageStories.map((story, i) => 
            <Article
              cy={i}
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

Saved.propTypes = {
  saved: PropTypes.arrayOf(PropTypes.shape({
    saved: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      tag: PropTypes.string
    })),
    setSavedStories: PropTypes.func,
    read: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      tag: PropTypes.string
    })),
    setReadStories: PropTypes.func,
    opened: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      tag: PropTypes.string
    })),
    setOpenedStories: PropTypes.func
  }))

}

export default Saved
