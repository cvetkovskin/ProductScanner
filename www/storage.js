// This is a JavaScript file

var storage ={
    items : [
        { "id": 0, "name" : "Coca Cola","thumbnail" : "img/products/cocacolathumbnail.jpg","photo" : ["img/products/cocacola1.png","img/products/cocacola2.jpg","img/products/cocacolazero1.png"],"desc" : "This is the original taste, the best there is. With just one sip and your world will change!","stock": 50, "code" : "4902410297796","address":"1-3-61 Kōraku, 文京区 Bunkyō-ku, Tōkyō-to","location":{"lat": 35.6716886, "lng": 139.7399652} },
        { "id": 1, "name" : "Coca Cola Zero","thumbnail" : "img/products/zerothumbnail.jpg","photo" : ["img/products/cocacolazero1.png","img/products/cocacolazero2.png"],"desc" : "Just as the original, but for those who lay low on the sugar. Zero as if zero sugar and zero worries!","stock": 25,"code" : "4902410297456","address":"Tōkyō-to, Bunkyō-ku, 文京区Yushima, 1−3−7","location":{"lat": 35.7076808, "lng": 139.74933922} },
        { "id": 2, "name" : "Fanta","thumbnail" : "img/products/fantathumbnail.jpg","photo" : ["img/products/fanta1.jpg","img/products/fanta2.png"],"desc" : "Refreshing as the tropical islands from where we get our oranges. Fanta and all of the joy in the world are yours!","stock": 0,"code" : "4902410234596","address":"5 Chome-1 Sotokanda, Chiyoda, Tokyo","location":{"lat": 35.7045016, "lng": 139.76475832} },
    ]
};

storage.init = function(){
    
};

storage.save = function(){
    
};

storage.has = function(code){
    var result = false;
    
    this.items.forEach(function(item){
        // alert("item code: "+item.code+" vs "+code+" Rezult is -> "+(item.code === code));
        if(item.code === code){
            result = true;
        }
    });
    
    return result;
}

storage.getByCode = function(code){
    var result = null;
    this.items.forEach(function(item){
        if(item.code == code){
            result = item;
        }
    });
    
    return result;
}