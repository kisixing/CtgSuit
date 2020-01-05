export function getDisplaySize() {
  const height = window.screen.height;
  const width = window.screen.width;
  // 1cm表现的
  const w1cm = document.getElementById("1cm").offsetWidth;
  const w = width / w1cm;
  const h = height / w1cm;
  return {w, h}
}

// 加密函数
export function compile(code) {
  let c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for(let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}

// 解密函数
export function uncompile(code) {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for(let i = 1; i < code.length; i ++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}