/**
 * Scroll to element by url hash
 */
export const scrollByHash = () => {
  setTimeout(function () {
    const { hash } = window.location
    const yOffset = window.innerWidth > 1023 ? -95 : -140

    if (hash) {
      const element = document.getElementById(hash.substr(1))

      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.pageYOffset + yOffset,
          behavior: 'smooth'
        })
      }
    }
  }, 0)
}
