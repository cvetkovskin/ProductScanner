var module = ons.bootstrap();
ons.disableAutoStatusBarFill();  // (Monaca enables StatusBar plugin by default)

"use strict";

var loadingDialog = null;
ons.ready(function() {
    // 読み込み中ダイアログの初期化
    ons.createAlertDialog('loading.html').then(function(alert) {
        loadingDialog = alert;
    });
});

module.controller('AppController', function($scope) {
  
    $scope.scan = function() {
        var onSuccess = function(result) {
            if (!result.cancelled) {   
                
                $scope.search(result.text, function() {
                    
                   document.querySelector('#navigator').pushPage('item_view.html');
                   
                }, function() {
                    
                    loadingDialog.hide();
                    ons.notification.confirm({
                        title: '商品検索に失敗しました',
                        message: '商品情報を取得できませんでした.スキャンした商品をデータベースに追加しますか？',
                        buttonLabel:  ["いいえ", "はい"],
                        animation: 'default', // もしくは'none'
                        callback: function(answer){
                            if(answer === 1){
                                document.querySelector('#navigator').pushPage("add_item.html");
                            }
                        }
                        
                    });
                });
            }
        };
        
        var onFailure = function(error) {
            ons.notification.alert({
                message: error,
                title: 'スキャンに失敗しました',
                buttonLabel: 'OK',
                animation: 'default', // もしくは'none'
            });
        };

        // バーコードをスキャンする
        plugins.barcodeScanner.scan(onSuccess, onFailure);
    };
    

    $scope.search = function(janCode, callback, failCallback) {
        
            $fh.cloud(
            {
                path: '/products/find_barcode',
                data: {
                    code: janCode
                }
            },
            function (res) {
                 // ons.notification.alert(JSON.stringify(res.status));
                if(res.status){
                    view=res.item;
                    callback();
                }else{
                    view.code=janCode;
                    failCallback();
                }    
            },
            function (code, errorprops, params) {
                alert('An error occured: ' + code + ' : ' + errorprops);
            }
        );   
            
    };

    
});
