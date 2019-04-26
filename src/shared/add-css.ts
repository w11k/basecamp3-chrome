export function addCSS(css: string) {
  const node = document.createElement('style');
  node.innerHTML = css;
  document.body.appendChild(node);
}
