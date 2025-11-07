export const addLocaleToLink = (url: string) => {
  if (!url) {
    return url;
  }
  if(window){
    const urlParams = new URLSearchParams(window.location.search);
    const localeValue = urlParams?.get('locale');
    const hasLocaleParam = url.includes('?locale=');
    if(localeValue && !hasLocaleParam){
      if(url.includes('?')){
        return url + '&locale=' + localeValue;
      } else if (url.includes('#')) {
        const index = url.indexOf('#');
        return url.slice(0, index) + '?locale=' + localeValue + url.slice(index);
      } else {
        return url + '?locale=' + localeValue;
      }
    }
    return url;
  }
  return url;
}