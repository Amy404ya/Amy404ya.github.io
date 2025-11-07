export const langChangeUrl = (i:any) => {
  var url = global.window.location.href;
  var tag = i.tag;
  let anchor = '';
  const index = url.indexOf('#');
  if (index > -1) {
    anchor = url.slice(index);
    url = url.slice(0, index);
  }
  if (url.includes('?locale')) {
    url = url.replace(/(\?|\&)locale=[^&]+/, `?locale=${tag}`);
  }else if(url.includes('&locale')){
    url = url.replace(/&locale=[^&]+/, `&locale=${tag}`)
  }else {
    url += (url.includes('?') ? '&' : '?') + 'locale=' + tag;
  }
  global.window.location.href = url + anchor;
}