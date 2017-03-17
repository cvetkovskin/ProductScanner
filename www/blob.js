// This is a JavaScript file

function convertFileToDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

function display(base64Img) {

    alert("Size of sample is: " + base64Img.length);
    var compressed = LZString.compress(base64Img);
    alert("Size of compressed sample is: " + compressed.length);
    var string = LZString.decompress(compressed);
    alert("Sample is: " + string);
    
    $('.output')
      .find('.textbox')
      .val(base64Img)
      .end()
      .find('#link')
      .attr('href', base64Img)
      .text(base64Img)
      .end()
      .find('#img')
      .attr('src',string)
      .end()
      .show()
 }
 