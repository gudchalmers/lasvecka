(function () {
  document.head = document.head || document.getElementsByTagName('head')[0];
  var canvas = document.createElement('canvas'),
    img = document.createElement('img'),
    oldLink = document.getElementById('favicon'),
    link = oldLink.cloneNode(true),
    week = 45;
  if (canvas.getContext) {
    canvas.height = canvas.width = 16;
    var ctx = canvas.getContext('2d'),
      textWidth = ctx.measureText(week).width;
    img.onload = function () {
      ctx.drawImage(this, 0, 0);
      ctx.font = 'bold 10px "helvetica", sans-serif';
      ctx.fillStyle = '#066EB0';
      ctx.fillText(week, (canvas.width / 2) - (textWidth / 2), 12);
      link.href = canvas.toDataURL('image/png');
      document.head.removeChild(oldLink);
      document.head.appendChild(link);
    };
    img.src = 'favicon.png';
  }
})();

setTimeout(function () { location.reload(); }, 25886000);