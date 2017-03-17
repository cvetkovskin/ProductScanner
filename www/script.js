// This is a JavaScript file

var view = {};

var images = [];

document.addEventListener('init', function(event) {
      var page = event.target;

      if (page.matches('#login')) {

        page.querySelector('#login_button').onclick = function() {
            
            $fh.cloud(
              {
                path: '/users/validate',
                data: {
                  user: document.querySelector('#username').value,
                  pass: document.querySelector('#password').value
                }
              },
              function (answer) {
                if(answer.result){
                    document.querySelector('#navigator').pushPage('list.html');
                }else{
                    ons.notification.alert("Inccorect email or password.");
                }
              },
              function (code, errorprops, params) {
                alert('An error occured: ' + code + ' : ' + JSON.stringify(errorprops));
              }
            );
            
          
        };
        
         page.querySelector('#signup_link').onclick = function() {
            document.querySelector('#navigator').pushPage('signup.html');
         };

      }else if (page.matches('#signup')) {    
        
        page.querySelector('#signup_button').onclick = function() {
            
            if(!document.querySelector('#s_username').value){
                ons.notification.alert("Please enter a username!");
                return;
            }
            
            if(!document.querySelector('#s_password').value){
                ons.notification.alert("Please enter a password!");
                return;
            }
           
           $fh.cloud(
              {
                path: '/users/signup',
                data: {
                  user: document.querySelector('#s_username').value,
                  pass: document.querySelector('#s_password').value
                }
              },
              function (answer) {
                if(answer.result){
                     ons.notification.alert({message: "You successfully signed up!", title: "Congratulations!"} )
                    document.querySelector('#navigator').popPage();;
                }else{
                    ons.notification.alert("Sing up unsuccessful!");
                }
              },
              function (code, errorprops, params) {
                alert('An error occured: ' + code + ' : ' + JSON.stringify(errorprops));
              }
            );
           
         };
            
      
      }else if (page.matches('#list_page')) {
            
            $fh.cloud(
                  {
                    path: '/products/all',
                    method: 'GET',
                    data: {}
                  },
                  function (items) {
                    
                    var list = document.querySelector('#product_list');
            
                    list.innerHTML = items.map(function(item){
                        return document.querySelector('#product_item').innerHTML
                        .replace('{{Name}}',item.name)
                        .replace('{{Src}}',item.thumbnail)
                        .replace('{{Num}}',item.stock)
                        .replace(new RegExp('{{ID}}', 'g'),"item_"+item.id);
                    }).join('');
                    
                  },
                  function (code, errorprops, params) {
                    alert('An error occured: ' + code + ' : ' + errorprops);
                  }
              );
            
            page.querySelector('#product_list').addEventListener('click',show);
            
            
            
      }else if (page.matches('#view_item')) {
            
            document.querySelector('.titlebar').innerHTML = document.querySelector('#text_template').innerHTML
                            .replace('{{text}}',view.name);
                
            document.querySelector('.stockbar').innerHTML = document.querySelector('#text_template').innerHTML
                 .replace('{{text}}',"Current stock: "+view.stock);
                
            document.querySelector('#description').innerHTML = document.querySelector('#text_template').innerHTML
                .replace('{{text}}',view.desc);  
                
            document.querySelector('#telephone').innerHTML = document.querySelector('#text_template').innerHTML
                .replace('{{text}}',view.telephone);
            
            document.querySelector('#address').innerHTML = document.querySelector('#text_template').innerHTML
                .replace('{{text}}',view.address);
                
            document.querySelector('#updated_at').innerHTML = document.querySelector('#text_template').innerHTML
                .replace('{{text}}',"Latest Update: "+view.updated_at);    
            
            
            var list = document.querySelector('#list_photos');    
            
            list.innerHTML = view.photo.map(function(item,index){
                return document.querySelector('#product_view').innerHTML
                .replace('{{ID}}','photo'+index)
                .replace('{{path}}',item)
                .replace('{{name}}',view.name);
            }).join('');
            
            
            $('.left_arrow').click(function(){
                var width=$('.card').width();
                $('#list_photos').scrollLeft($('#list_photos').scrollLeft()-width);
            });
            
            $('.right_arrow').click(function(){
                 var width=$('.card').width();
                 $('#list_photos').scrollLeft($('#list_photos').scrollLeft()+width);        
            });
            
            $('#loc').click(function(){
                var location=view.location.lat+","+view.location.lng;
                window.open("http://maps.google.com/maps?q="+location+"&ll="+location+"&z=17");     
            });
            
            $('#tel').click(function(){
                document.location.href = "tel:"+view.telephone;     
            });
            
            var map =  new google.maps.Map(document.getElementById("map_canvas"), {
                zoom: 18,
                center: view.location
            });
            
            var marker = new google.maps.Marker({
              position: view.location,
              map: map
            }); 
                    
        }else if(page.matches('#add_new')){
            
            images.length = 0;
            
            document.querySelector('#item_code').innerHTML = document.querySelector('#text_template').innerHTML
                .replace('{{text}}',"Barcode: "+view.code);
                
            page.querySelector('#button_add_item').onclick = function() {
                
                view.name=document.querySelector('#name').value;
                view.telephone=document.querySelector('#tel').value;
                view.address=document.querySelector('#store_address').value;
                view.desc=document.querySelector('#desc').value; 
                view.stock=document.querySelector('#stock').value;
                view.photo=images;
                view.updated_at=getTodayFormat();
                
                var  geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': view.address}, function(results, status) {
                    if (status == 'OK') {
                        view.location=results[0].geometry.location;
                         
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
                
                if(view.location){
                          
                    $fh.cloud(
                      {
                        path: '/products/save',
                        data: {
                          entry: view
                        }
                      },
                      function (answer) {
                        if(answer.status){
                            ons.notification.alert({message: "You successfully saved a new product!", title: "Congratulations!"} )
                            document.querySelector('#navigator').resetToPage('list.html');
                        }else{
                            ons.notification.alert("Saving not successful.");
                        }
                      },
                      function (code, errorprops, params) {
                        alert('An error occured: ' + code + ' : ' + JSON.stringify(errorprops));
                      }
                    );
                
                }else{
                      ons.notification.alert({message: "Couldn't retrieve location. Please try again!", title: "Error"})
                }
            }
                
        }
        
      
});

      
function show(event){
    
    $fh.cloud(
        {
            path: '/products/find_one',
            data: {
                id: event.target.parentElement.id.split('_')[1]
            }
        },
        function (res) {
            if(res.status){
                view=res.item;
                document.querySelector('#navigator').pushPage('item_view.html');
            }else{
                ons.notification.alert("Error retrieving file.");
            }  
        },
        function (code, errorprops, params) {
            alert('An error occured: ' + code + ' : ' + errorprops);
        }
    );    
    
    
}

function refresh_images(){
    var text = ' <ons-col width="104px">' +
                  '<img src="img/add_image.png" alt="Nesto mse" width="100" class="to-image" id="add_image" onclick="add_img()">' +
                '</ons-col>' ;

    images.map(function(photo,index){
        text +=  '<ons-col width="104px">'+
              '<img src='+photo+' alt="Nesto mse" width="100" class="to-image" id='+index+' onclick="remove(this.id)">' +
              '</ons-col>';
        });
           
    document.querySelector('#images').innerHTML=text;
}

function add_img(){
    
    ons.notification.alert({
            title: 'Adding a picture!',
            message: 'Take a picture with the camera or add one from your gallery',
            buttonLabel:  ["Cancel", "Camera", "Gallery"],
            animation: 'default', // もしくは'none'
            callback: function(answer){
                if(answer === 1){
                    navigator.camera.getPicture (onSuccess, onFail, 
                            { quality: 50, destinationType: Camera.DestinationType.DATA_URL, allowEdit: true, targetWidth: 500, targetHeight: 500});
                }else if(answer === 2){
                     navigator.camera.getPicture(onSuccess, onFail, 
                          { quality: 50, destinationType: Camera.DestinationType.DATA_URL,
                          sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM, allowEdit: true, targetWidth: 500, targetHeight: 500 });  
                }
            }  
    });
    

        //A callback function when snapping picture is success.
        function onSuccess (imageData) {
            images.push("data:image/jpeg;base64," + imageData);
            refresh_images();
        }
        

        //A callback function when snapping picture is fail.
        function onFail (message) {
            alert ('Error occured: ' + message);
        }
        
    
} 

function add_thumb(){
    
    ons.notification.alert({
            title: 'Adding a thumbnail!',
            message: 'Take a picture with the camera or add one from your gallery',
            buttonLabel:  ["Cancel", "Camera", "Gallery"],
            animation: 'default', // もしくは'none'
            callback: function(answer){
                if(answer === 1){
                    navigator.camera.getPicture (onSuccess, onFail, 
                            { quality: 50, destinationType: Camera.DestinationType.DATA_URL, allowEdit: true, targetWidth: 50, targetHeight: 50});
                }else if(answer === 2){
                     navigator.camera.getPicture(onSuccess, onFail, 
                          { quality: 50, destinationType: Camera.DestinationType.DATA_URL,
                          sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM ,allowEdit: true, targetWidth: 50, targetHeight: 50});  
                }
            }  
    });
    

        //A callback function when snapping picture is success.
        function onSuccess (imageData) {
            view.thumbnail = "data:image/jpeg;base64," + imageData;
            document.querySelector('#thumb').src="data:image/jpeg;base64," + imageData;
        }
        

        //A callback function when snapping picture is fail.
        function onFail (message) {
            alert ('Error occured: ' + message);
        }
        
    
}

function remove(id){
    ons.notification.confirm(
        {title:"Remove Picture?", 
        message: "Do you want to remove this picture?",
        callback: function(answer){
            if(answer===1){
                images.splice(id,1);
                refresh_images();
            }
        }})
}

function getTodayFormat() {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();
    
    if(dd<10) {
        dd='0'+dd
    } 
    
    if(mm<10) {
        mm='0'+mm
    } 
    
    return yyyy+'-'+mm+'-'+dd;
    
}