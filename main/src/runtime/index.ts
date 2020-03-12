window.addEventListener("cat", function(e:any) { console.log(e.detail) });
const btn = document.createElement('div')
btn.innerHTML = 'abc'
Object.assign(btn.style,{
    position:'fixed',
    width:'100px',
    height:'100px',
    'border-radius':'100px',
    background:'skyblue',
    bottom:'0',
    right:'0',
    cursor:'pointer'
})
// document.body.appendChild(btn)