var express = require('express');
var fs = require('node:fs');
var path = require('node:path')
const app = express();



app.use(express.static(path.join(__dirname, "public")));

app.use('/video', (req, res)=> {
    fs.readFile('./public/sample_1280x720_surfing_with_audio.mp4', (err, data) => {
        const headers = {
            "Content-Type" : "video/mp4"
        }
        res.writeHead(200, headers);
        res.write(data);
        res.end();
    });
});


app.use('/videostream', (req, res)=> {

    let filePath = './public/sample_1280x720_surfing_with_audio.mp4';
    let defaultChunkSize = 1*1024*1024;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range || `bytes=0-`;

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = Math.min(start+defaultChunkSize, fileSize-1);

    const chunkSize = end-start+1;
    const file = fs.createReadStream(filePath, {start,end});

    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length": chunkSize,
        "Content-Type" : "video/mp4"
    }

    res.writeHead(206, headers);
    file.pipe(res);
    file.on('end', () => {
        // res.end();
    });

});


app.listen(3000, ()=> {
    console.log('connected');
});