/* App.js v1.0.1 */

function calcWidth() {
  var width = 0;
  if (window.innerWidth <= 767){
    if (window.innerWidth >= 500){
      width = 250;
    } else {
      width = window.innerWidth - 200;
    }
  } else {
    width = 300;
  }
  return Math.ceil(width);
}

const myTags = [
  'Bootstrap', 'CSS', 'Docker', 'Git', 'HTML', 'JavaScript', 'jQuery', 'Material UI', 'MongoDB', 'MySQL',
  '.Net Core', 'Node.js', 'PHP', 'Python', 'React', 'SASS', 'TypeScript', 'Vue.js',
];

// var tagCloud = TagCloud('.content-tag-cloud', myTags);
var tagCloud = TagCloud('.content-tag-cloud', myTags, {
  // radius in px
  // radius: 300,
  radius: calcWidth(),
  // animation speed
  // slow, normal, fast
  maxSpeed: 'fast',
  initSpeed: 'fast',
  // 0 = top
  // 90 = left
  // 135 = right-bottom
  direction: 135,
  // interact with cursor move on mouse out
  keep: true
});

var counter = 0;
var i = setInterval(function(){

  var div0 = document.getElementsByClassName('tagcloud--item')[0];
  div0.innerHTML = `<img src="imgs/bootstrap.svg" width="40" height="auto" alt="Bootstrap">`;
  
  var div1 = document.getElementsByClassName('tagcloud--item')[1];
  div1.innerHTML = `<img src="imgs/css-3.svg" width="40" height="auto" alt="CSS">`;
  
  var div2 = document.getElementsByClassName('tagcloud--item')[2];
  div2.innerHTML = `<img src="imgs/docker.svg" width="40" height="auto" alt="Docker">`;

  var div3 = document.getElementsByClassName('tagcloud--item')[3];
  div3.innerHTML = `<img src="imgs/git.svg" width="50" height="auto" alt="Git">`;

  var div4 = document.getElementsByClassName('tagcloud--item')[4];
  div4.innerHTML = `<img src="imgs/html-5.svg" width="40" height="auto" alt="HTML">`;

  var div5 = document.getElementsByClassName('tagcloud--item')[5];
  div5.innerHTML = `<img src="imgs/javascript.svg" width="40" height="auto" alt="JavaScript">`;
  
  var div6 = document.getElementsByClassName('tagcloud--item')[6];
  div6.innerHTML = `<img src="imgs/jquery.svg" width="70" height="auto" alt="jQuery">`;

  var div7 = document.getElementsByClassName('tagcloud--item')[7];
  div7.innerHTML = `<img src="imgs/material-ui.svg" width="40" height="auto" alt="Material UI">`;

  var div8 = document.getElementsByClassName('tagcloud--item')[8];
  div8.innerHTML = `<img src="imgs/mongodb.svg" width="70" height="auto" alt="MongoDB">`;

  var div9 = document.getElementsByClassName('tagcloud--item')[9];
  div9.innerHTML = `<img src="imgs/mysql.svg" width="50" height="auto" alt="MySQL">`;

  var div10 = document.getElementsByClassName('tagcloud--item')[10];
  div10.innerHTML = `<img src="imgs/net-core.svg" width="50" height="auto" alt=".Net Core">`;

  var div11 = document.getElementsByClassName('tagcloud--item')[11];
  div11.innerHTML = `<img src="imgs/nodejs.svg" width="60" height="auto" alt="Node.js">`;

  var div12 = document.getElementsByClassName('tagcloud--item')[12];
  div12.innerHTML = `<img src="imgs/php.svg" width="70" height="auto" alt="PHP">`;

  var div13 = document.getElementsByClassName('tagcloud--item')[13];
  div13.innerHTML = `<img src="imgs/python.svg" width="40" height="auto" alt="Python">`;

  var div14 = document.getElementsByClassName('tagcloud--item')[14];
  div14.innerHTML = `<img src="imgs/react.svg" width="45" height="auto" alt="React">`;

  var div15 = document.getElementsByClassName('tagcloud--item')[15];
  div15.innerHTML = `<img src="imgs/sass.svg" width="45" height="auto" alt="SASS">`;

  var div16 = document.getElementsByClassName('tagcloud--item')[16];
  div16.innerHTML = `<img src="imgs/typescript.svg" width="40" height="auto" alt="TypeScript">`;

  var div17 = document.getElementsByClassName('tagcloud--item')[17];
  div17.innerHTML = `<img src="imgs/vuejs.svg" width="40" height="auto" alt="Vue.js">`;

  counter++; if(counter === 1) { clearInterval(i); }
}, 10);

setTimeout(function(){
  $('.loading').hide();
  $('.content-all').css({ 'display': 'block', 'width': '100%', 'display' : 'flex', 'align-items' : 'center' });
}, 1000);

alert('W: ' + window.innerWidth);
