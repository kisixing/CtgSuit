export function getDisplaySize() {
  const height = window.screen.height;
  const width = window.screen.width;
  // 1cm表现的
  const w1cm = document.getElementById("1cm").offsetWidth;
  const w = width / w1cm;
  const h = height / w1cm;
  return {w, h}
}
