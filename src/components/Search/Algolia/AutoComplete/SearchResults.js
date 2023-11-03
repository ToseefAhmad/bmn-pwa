import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connectAutoComplete } from 'react-instantsearch-dom'
import Autosuggest from 'react-autosuggest'
import resultCssClasses from './searchResults.less'
import algoliaCssClasses from '../algolia.less'
import t from '@bmn/translate'
import { getUrlPath } from '../../../../utils/urlParser'

import { Link } from 'react-router-dom'

// This should be set to true whenever multiple indexes need rendering
export const MULTI_SECTION = false

class SearchResults extends Component {
  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
  }

  state = {
    value: this.props.currentRefinement,
  }

  onChange = (event, { newValue }) =>
    this.setState({ value: newValue })

  removeSearchQuery = () => {
    let self = this

    /**
     * Remove search string after it's filled by Algolia.
     * @todo Prevent input field from being filled in the first place.
     */
    setTimeout(function () {
      self.setState({ value: '' })
    }, 0)
  }

  onKeyDown = (e, history) => {
    if (this.state.value && e.key === 'Enter') {
      history.replace(this.getAllResultsUrl())

      this.removeSearchQuery()
    }
  }

  onSuggestionsFetchRequested = ({ value }) =>
    this.props.refine(value)

  onSuggestionsClearRequested = () =>
    this.props.refine()

  getSuggestionValue = (hit) =>
    hit.name

  renderSuggestionsContainer = ({ containerProps, children }) => {
    let suggestions = children ? children : []

    return (
      <div { ...containerProps }> {
        MULTI_SECTION === true
          ? suggestions.map((value, key) => {
            return <Fragment key={ key }>
              { this.getSuggestionsContainer(value) }
            </Fragment>
          })
          : this.getSuggestionsContainer(suggestions)
      }
      </div>
    )
  }

  getSuggestionsContainer = suggestions =>
    <div className={ resultCssClasses.searchResults__container }>
      { suggestions }
      <div className={ resultCssClasses.searchResults__allResultsWrapper }>
        { t({ s: 'View all products in' }) }
        <Link
          to={ this.getAllResultsUrl() }
          title={  this.getAllResultsText() }
          onClick={ (e) => this.removeSearchQuery(e) }
        >
          <span>{ t({ s: 'all categories' }) }</span>
        </Link>
      </div>
    </div>

  renderSuggestion = (hit) =>
    <Link
      to={ getUrlPath(hit.url) }
      className={ resultCssClasses.searchResults__wrapper }
      onClick={ (e) => this.removeSearchQuery(e) }
    >
      <div className={ resultCssClasses.searchResults__imageWrapper }>
        <img
          src={ hit.thumbnail_url }
          alt={ hit.name }
          title={ hit.name }
        />
      </div>
      <div className={ resultCssClasses.searchResults__infoWrapper }>
        <span className={ resultCssClasses.searchResults__link }>
          { hit.name }
        </span>
        <div className={ resultCssClasses.searchResults__secondaryData }>
          <span>
            { hit.brand }
          </span>
        </div>
      </div>
    </Link>

  getAllResultsText = (withValue = true) =>
    withValue
      ? t({ s: 'All results for %1', r: [this.state.value] })
      : t({ s: 'All results for' })

  getAllResultsUrl = () =>
    '/search?query=' + this.state.value

  renderSectionTitle = (section) =>
    section.index

  getSectionSuggestions = (section) =>
    section.hits

  render () {
    const { hits, onSuggestionSelected, history } = this.props
    const { value } = this.state

    const inputProps = {
      placeholder: t({ s: 'Search for products, categories, pages...' }),
      onChange: this.onChange,
      onKeyDown: (e) => this.onKeyDown(e, history),
      value,
    }

    return (
      <>
        <Autosuggest
          suggestions={ hits }
          multiSection={ MULTI_SECTION }
          onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
          onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
          renderSuggestionsContainer={ this.renderSuggestionsContainer }
          onSuggestionSelected={ onSuggestionSelected }
          getSuggestionValue={ this.getSuggestionValue }
          renderSuggestion={ this.renderSuggestion }
          inputProps={ inputProps }
          theme={ algoliaCssClasses }
          renderSectionTitle={ this.renderSectionTitle }
          getSectionSuggestions={ this.getSectionSuggestions }
        />
        {
          value
            ? <>
                <a
                  href="#"
                  title={ t({ s: 'Delete search query: %1', r: [value] }) }
                  onClick={ this.removeSearchQuery }
                  className={ algoliaCssClasses.searchResultContainer__removeIcon }
                />
                <Link
                  to={ this.getAllResultsUrl() }
                  title={ this.getAllResultsText() }
                  className={ algoliaCssClasses.searchResultContainer__searchIcon }
                />
              </>
            :
            <>
              <a
                href="#"
                className={ algoliaCssClasses.searchResultContainer__removeIcon }
                style={ { visibility: 'hidden' } }
              />
              <span className={ algoliaCssClasses.searchResultContainer__searchIcon }/>
            </>
        }
      </>
    )
  }
}

export default connectAutoComplete(SearchResults)
