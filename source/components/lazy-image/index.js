import React from 'react'
import withStyles from '../with-styles'
import styles from './styles'
import PropTypes from 'prop-types'
import Loading from '../loading'

/**
 * Render a colored square with a loading spinner in place of an image whilst it's being loaded.
 *
 * Useful to prevent a layout from breaking, flickering or changing size during a page load.
*/

class LazyImage extends React.Component {
  constructor () {
    super()
    this.state = {
      loaded: false,
      loading: false,
      hasEventListener: false
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount () {
    const { url } = this.props
    if (this.shouldLoadImage()) {
      this.loadImage(url)
    } else if (this.props.lazy) {
      window.addEventListener('scroll', this.handleScroll)
      this.setState({ hasEventListener: true })
    }
  }

  componentWillUnmount () {
    if (this.state.hasEventListener) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }

  componentWillReceiveProps ({ url, lazy }) {
    if (lazy !== this.props.lazy) {
      console.error('The lazy prop on <LazyImage /> should never change')
    } else if (url !== this.props.url) {
      this.setState({ loaded: false, loading: false })
      if (this.shouldLoadImage()) {
        this.loadImage(url)
      }
    }
  }

  handleScroll () {
    if (this.shouldLoadImage()) {
      this.loadImage(this.props.url)
    }
  }

  shouldLoadImage () {
    if (this.props.url) {
      if (!this.state.loading && !this.state.loaded) {
        if (this.props.lazy) {
          return this.isImageInViewport()
        } else {
          return true
        }
      } else return false
    } else return false
  }

  loadImage (url) {
    this.setState({
      loading: true
    })
    let img = document.createElement('img')
    img.onload = () => {
      this.setState({
        loaded: true,
        loading: false
      })
      this.props.onLoad()
    }
    img.src = url
  }

  isImageInViewport () {
    const itemFromTopOfViewport = this.image && this.image.getBoundingClientRect().top
    const windowHeight = window.innerHeight
    const isImageVisible = itemFromTopOfViewport < windowHeight
    return isImageVisible
  }

  render () {
    const {
      classNames,
      url,
      children,
      loadingProps
    } = this.props

    const { loaded } = this.state

    const spinner = children || <Loading {...loadingProps} />

    return (
      <div
        ref={ref => { this.image = ref }}
        style={{backgroundImage: loaded ? `url('${url}')` : ''}}
        className={`c11n-lazy-image ${classNames.root}`}
      >
        <div
          className={classNames.overlay}
          style={{ opacity: loaded ? 0 : 1 }}
        >
          {!loaded && spinner}
        </div>
      </div>
    )
  }
}

LazyImage.propTypes = {
  /**
  * Url of the image to be loaded and displayed
  */
  url: PropTypes.string,

  /**
  * If image loading should be delayed until image has entered the viewport
  */
  lazy: PropTypes.bool,

  /**
  * Background color while image is loading
  */
  color: PropTypes.string,

  /**
  * Props to be spread onto the constructicon loading dots
  */
  loadingProps: PropTypes.object,

  /**
  * Optional callback that fires when image has been loaded
  */
  onLoad: PropTypes.func,

  /**
  * Styles to be merged with the image wrapper. This is where you should set a custom height and width
  */
  styles: PropTypes.object,

  /**
  * transition to be used to fade out the overlay
  */
  transition: PropTypes.string,

  /**
  * Optional children that will be rendered when loading, instead of the constructicon loading dots
  * */
  children: PropTypes.any
}

LazyImage.defaultProps = {
  lazy: false,
  loadingProps: {},
  onLoad: () => {},
  color: 'light',
  transition: 'opacity 1s ease'
}

export default withStyles(styles)(LazyImage)
