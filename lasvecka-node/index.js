const express = require('express');
const moment = require('moment');
const app = express();
const computeTime = require('./calc_date.js');
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  let studyweek = computeTime();
  let studyweekNum = studyweek.replace('LV ', '').replace('Självstudier', 'S').replace('Tentavecka', 'T');
  // eg. 2023-W45
  let week = moment().format('YYYY-[W]WW');
  let data = { studyweek, week, studyweekNum };
  res.send(render(data));
});

app.get('/api', (req, res) => {
  res.send(computeTime());
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

const render = (data) => {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>läsvecka.nu | ${data.studyweek}</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" id="favicon">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="description" content="läsvecka.nu ger dig aktuell läsvecka, utan några konstigheter!">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://lasvecka.nu/">
    <meta property="og:title" content="läsvecka.nu | ${data.studyweek}">
    <style>
      html, body { height: 100%; background-color: #90c0de; overflow: hidden; }
      time {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        margin: -110px 0 0 0;
        height: 220px;
        text-align: center;
        color: #1c7bb7;
        font-family: Arial, serif;
        font-size: 260px;
        line-height: 227px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <time datetime="${data.week}">${data.studyweek}</time>
    <script>
      (function () {
        document.head = document.head || document.getElementsByTagName('head')[0];
        var canvas = document.createElement('canvas'),
          img = document.createElement('img'),
          oldLink = document.getElementById('favicon'),
          link = oldLink.cloneNode(true),
          week = '${data.studyweekNum}';
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
          img.src = 'faviconbkg.png';
        }
      })();

      setTimeout(function () { location.reload(); }, 25886000);
    </script>
  </body>
</html>`;
  return html.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '').replace(/ {2,}/g, '');
}