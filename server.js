const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');

const app = express();
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function defineContentType(items, folderPath) {
  // Iterate over the items in the folder
  items.forEach((item) => {
    const itemPath = path.join(folderPath, item);

    // Check if the item is a file or a directory
    fs.stat(itemPath, (err, stats) => {
      if (err) {
        console.error('Error getting item information:', err);
        return;
      }

      if (stats.isFile()) {
        console.log(`${item} is a file`);
        return 'file';
      } else if (stats.isDirectory()) {
        console.log(`${item} is a directory`);
        return 'Directory';
      } else {
        console.log(`${item} is neither a file nor a directory`);
        return 'Something Else'
      }
    });
  });
}

// Helper function to generate HTML content
function generateHtmlContent(files) {
  console.log("files ",files);
  const items = files.map((file) => `<li><a href=${path.resolve(__dirname, "./tmp",file)}>${file} ${defineContentType(files,path.resolve(__dirname, "./tmp" ))|| 'Unknown'}</a></li>`).join('\n');
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Directory Listing</title>
      </head>
      <body>
        <h1>Directory Listing</h1>
        <ul>
          ${items}
        </ul>
      </body>
    </html>
  `;
  return html;
}

app.get('/content',(req,res)=>{
  const absolutePath = path.resolve(__dirname, "./tmp");
  console.log("absolute path ",absolutePath);
  // Read the contents of the folder
  fs.readdir(absolutePath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    // Generate HTML content
    const htmlContent = generateHtmlContent(files);

    // Set the response headers
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    
    // Send the HTML content as the response
    res.end(htmlContent);
  });

})

app.listen(port, "0.0.0.0" , () => {
  console.log(`Example app listening on port ${port}`)
})