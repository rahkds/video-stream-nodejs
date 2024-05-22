var fs = require('node:fs');
var streams = require('node:stream');
var zlip = require('node:zlib');


function main() {
    let readstream = fs.createReadStream('./input.txt');
    let writestream = fs.createWriteStream('./output1.txt');
    const upperCaseStream = new streams.Transform({
        transform: function(chunk, encoding, callback) {
            let uppercaseChunk = chunk.toString().toUpperCase();
            callback(null, uppercaseChunk);
        }
    });

    const replaceStream = new streams.Transform({
        transform: function(chunk, encoding, callback) {
            let replaceChunk = chunk.toString().replace(/rahul/gi, 'vijay');
            callback(null, replaceChunk);
        }
    })

    // readstream.pipe(upperCaseStream).pipe(replaceStream).pipe(zlip.createGzip()).pipe(writestream);

    // readstream.on('end', () => {
    //     console.log('completed');
    // }); 


    streams.pipeline(readstream, upperCaseStream, replaceStream, writestream, (err)=> {
        console.log('error == ', err);
    });

}

main();
